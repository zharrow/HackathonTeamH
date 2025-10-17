import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateReservationSchema } from "@/lib/validations/reservation";

/**
 * GET /api/admin/reservations/:id
 * Get a single reservation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        babyfoot: true,
        referee: { select: { id: true, name: true, email: true, image: true } },
        redDefense: {
          select: { id: true, name: true, email: true, image: true },
        },
        redAttack: {
          select: { id: true, name: true, email: true, image: true },
        },
        blueDefense: {
          select: { id: true, name: true, email: true, image: true },
        },
        blueAttack: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!reservation) {
      return Response.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: reservation });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return Response.json(
      { error: "Erreur lors de la récupération de la réservation" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/reservations/:id
 * Update a reservation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateReservationSchema.parse(body);

    // If changing date or table, check for overlaps
    if (validated.babyfootId || validated.partyDate) {
      const current = await prisma.reservation.findUnique({
        where: { id },
        select: { babyfootId: true, partyDate: true },
      });

      if (!current) {
        return Response.json(
          { error: "Réservation non trouvée" },
          { status: 404 }
        );
      }

      const overlapping = await prisma.reservation.findFirst({
        where: {
          id: { not: id },
          babyfootId: validated.babyfootId || current.babyfootId,
          partyDate: validated.partyDate
            ? new Date(validated.partyDate)
            : current.partyDate,
          status: {
            in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
          },
        },
      });

      if (overlapping) {
        return Response.json(
          { error: "Un créneau existe déjà pour cette table à cette date" },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (validated.babyfootId) updateData.babyfootId = validated.babyfootId;
    if (validated.partyDate)
      updateData.partyDate = new Date(validated.partyDate);
    if (validated.status) updateData.status = validated.status;
    if (validated.refereeId !== undefined)
      updateData.refereeId = validated.refereeId;
    if (validated.redDefenseId !== undefined)
      updateData.redDefenseId = validated.redDefenseId;
    if (validated.redAttackId !== undefined)
      updateData.redAttackId = validated.redAttackId;
    if (validated.blueDefenseId !== undefined)
      updateData.blueDefenseId = validated.blueDefenseId;
    if (validated.blueAttackId !== undefined)
      updateData.blueAttackId = validated.blueAttackId;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        babyfoot: true,
        referee: { select: { id: true, name: true, email: true, image: true } },
        redDefense: {
          select: { id: true, name: true, email: true, image: true },
        },
        redAttack: {
          select: { id: true, name: true, email: true, image: true },
        },
        blueDefense: {
          select: { id: true, name: true, email: true, image: true },
        },
        blueAttack: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return Response.json({ success: true, data: reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return Response.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reservations/:id
 * Delete/Cancel a reservation and promote the first PENDING to CONFIRMED
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the reservation before deleting
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return Response.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Check if this is a CONFIRMED reservation
    const wasConfirmed = reservation.status === "CONFIRMED";
    const babyfootId = reservation.babyfootId;
    const partyDate = reservation.partyDate;

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id },
    });

    // If it was CONFIRMED, promote the first PENDING
    if (wasConfirmed) {
      const nextPending = await prisma.reservation.findFirst({
        where: {
          babyfootId: babyfootId,
          partyDate: partyDate,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "asc", // First in queue
        },
      });

      if (nextPending) {
        await prisma.reservation.update({
          where: { id: nextPending.id },
          data: { status: "CONFIRMED" },
        });

        return Response.json({
          success: true,
          message: "Réservation supprimée et prochaine réservation confirmée",
          promoted: true,
          promotedReservationId: nextPending.id,
        });
      }
    }

    return Response.json({
      success: true,
      message: "Réservation supprimée",
      promoted: false,
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return Response.json(
      { error: "Erreur lors de la suppression de la réservation" },
      { status: 500 }
    );
  }
}
