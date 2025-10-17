import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * DELETE /api/reservations/[id]
 * Cancel a reservation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const reservationId = params.id;
    const userId = session.user.id;

    // Find reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { babyfoot: true },
    });

    if (!reservation) {
      return Response.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Check if user is part of this reservation
    const isUserInReservation =
      reservation.refereeId === userId ||
      reservation.redDefenseId === userId ||
      reservation.redAttackId === userId ||
      reservation.blueDefenseId === userId ||
      reservation.blueAttackId === userId;

    if (!isUserInReservation) {
      return Response.json(
        { error: "Non autorisé à annuler cette réservation" },
        { status: 403 }
      );
    }

    // Can't cancel if already finished
    if (reservation.status === "FINISHED") {
      return Response.json(
        { error: "Impossible d'annuler une réservation terminée" },
        { status: 400 }
      );
    }

    const wasConfirmed = reservation.status === "CONFIRMED" || reservation.status === "IN_PROGRESS";

    // Cancel the reservation
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" },
    });

    // If this was a CONFIRMED reservation, promote the first PENDING reservation
    if (wasConfirmed) {
      const nextPendingReservation = await prisma.reservation.findFirst({
        where: {
          babyfootId: reservation.babyfootId,
          partyDate: reservation.partyDate,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "asc", // First in queue
        },
      });

      if (nextPendingReservation) {
        // Promote to CONFIRMED
        await prisma.reservation.update({
          where: { id: nextPendingReservation.id },
          data: { status: "CONFIRMED" },
        });

        // Update queue entry
        await prisma.queueEntry.updateMany({
          where: {
            userId: nextPendingReservation.redDefenseId || "",
            babyfootId: reservation.babyfootId,
            notifiedAt: null,
          },
          data: {
            notifiedAt: new Date(),
          },
        });

        // TODO: Send notification to user that they're confirmed
      } else {
        // No one waiting, make babyfoot available
        await prisma.babyfoot.update({
          where: { id: reservation.babyfootId },
          data: { status: "AVAILABLE" },
        });
      }
    }

    return Response.json({
      success: true,
      message: "Réservation annulée avec succès",
    });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return Response.json(
      { error: "Erreur lors de l'annulation de la réservation" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reservations/[id]
 * Update reservation status (start/finish game)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const reservationId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { action, finalScoreRed, finalScoreBlue } = body; // 'start' | 'finish'

    // Find reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { babyfoot: true },
    });

    if (!reservation) {
      return Response.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Check if user is part of this reservation
    const isUserInReservation =
      reservation.refereeId === userId ||
      reservation.redDefenseId === userId ||
      reservation.redAttackId === userId ||
      reservation.blueDefenseId === userId ||
      reservation.blueAttackId === userId;

    if (!isUserInReservation) {
      return Response.json(
        { error: "Non autorisé à modifier cette réservation" },
        { status: 403 }
      );
    }

    if (action === "start") {
      // Start the game
      if (reservation.status !== "CONFIRMED") {
        return Response.json(
          { error: "Seules les réservations confirmées peuvent être démarrées" },
          { status: 400 }
        );
      }

      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "IN_PROGRESS" },
      });

      // NOW set the babyfoot to OCCUPIED (only when game actually starts)
      await prisma.babyfoot.update({
        where: { id: reservation.babyfootId },
        data: { status: "OCCUPIED" },
      });

      return Response.json({
        success: true,
        data: updatedReservation,
        message: "Partie démarrée",
      });
    } else if (action === "finish") {
      // Finish the game
      if (reservation.status !== "IN_PROGRESS") {
        return Response.json(
          { error: "Seules les parties en cours peuvent être terminées" },
          { status: 400 }
        );
      }

      // Validate scores if provided
      if (finalScoreRed !== undefined && finalScoreBlue !== undefined) {
        if (
          typeof finalScoreRed !== "number" ||
          typeof finalScoreBlue !== "number" ||
          finalScoreRed < 0 ||
          finalScoreBlue < 0 ||
          finalScoreRed > 10 ||
          finalScoreBlue > 10
        ) {
          return Response.json(
            { error: "Scores invalides. Les scores doivent être entre 0 et 10" },
            { status: 400 }
          );
        }
      }

      // Update reservation with FINISHED status and scores
      const updateData: any = {
        status: "FINISHED",
      };

      if (finalScoreRed !== undefined && finalScoreBlue !== undefined) {
        updateData.finalScoreRed = finalScoreRed;
        updateData.finalScoreBlue = finalScoreBlue;
      }

      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: updateData,
      });

      // Make babyfoot available or promote next in queue
      const now = new Date();
      const nextPendingReservation = await prisma.reservation.findFirst({
        where: {
          babyfootId: reservation.babyfootId,
          status: "PENDING",
          partyDate: {
            gte: now,
          },
        },
        orderBy: [
          { partyDate: "asc" },
          { createdAt: "asc" },
        ],
      });

      if (nextPendingReservation) {
        // Promote to CONFIRMED
        await prisma.reservation.update({
          where: { id: nextPendingReservation.id },
          data: { status: "CONFIRMED" },
        });

        // Notify user
        await prisma.queueEntry.updateMany({
          where: {
            userId: nextPendingReservation.redDefenseId || "",
            babyfootId: reservation.babyfootId,
            notifiedAt: null,
          },
          data: {
            notifiedAt: new Date(),
          },
        });
      } else {
        // No one waiting, make babyfoot available
        await prisma.babyfoot.update({
          where: { id: reservation.babyfootId },
          data: { status: "AVAILABLE" },
        });
      }

      return Response.json({
        success: true,
        data: updatedReservation,
        message: "Partie terminée",
      });
    }

    return Response.json(
      { error: "Action invalide" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating reservation:", error);
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        error: "Erreur lors de la mise à jour de la réservation",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
