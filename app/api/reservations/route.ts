import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/reservations
 * Get user's reservations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;

    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { refereeId: userId },
          { redDefenseId: userId },
          { redAttackId: userId },
          { blueDefenseId: userId },
          { blueAttackId: userId },
        ],
      },
      include: {
        babyfoot: true,
        referee: {
          select: { id: true, name: true, email: true, image: true },
        },
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
      orderBy: { partyDate: "desc" },
    });

    return Response.json({ success: true, data: reservations });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations
 * Create a new reservation
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { babyfootId, partyDate, format } = body;

    if (!babyfootId || !partyDate || !format) {
      return Response.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const reservationDate = new Date(partyDate);

    // Check if babyfoot exists and is available
    const babyfoot = await prisma.babyfoot.findUnique({
      where: { id: babyfootId },
    });

    if (!babyfoot) {
      return Response.json(
        { error: "Babyfoot non trouvé" },
        { status: 404 }
      );
    }

    if (babyfoot.status === "MAINTENANCE") {
      return Response.json(
        { error: "Ce babyfoot est en maintenance" },
        { status: 400 }
      );
    }

    // Check if user already has a reservation at this time
    const userExistingReservation = await prisma.reservation.findFirst({
      where: {
        partyDate: reservationDate,
        status: {
          in: ["CONFIRMED", "IN_PROGRESS"],
        },
        OR: [
          { refereeId: userId },
          { redDefenseId: userId },
          { redAttackId: userId },
          { blueDefenseId: userId },
          { blueAttackId: userId },
        ],
      },
    });

    if (userExistingReservation) {
      return Response.json(
        { error: "Vous avez déjà une réservation à cette heure" },
        { status: 400 }
      );
    }

    // Check if there's already a CONFIRMED or IN_PROGRESS reservation for this slot
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        babyfootId: babyfootId,
        partyDate: reservationDate,
        status: {
          in: ["CONFIRMED", "IN_PROGRESS"],
        },
      },
    });

    // Determine status and queue position
    const isSlotAvailable = !existingReservation;
    const reservationStatus = isSlotAvailable ? "CONFIRMED" : "PENDING";

    // Get queue position if PENDING
    let queuePosition = 0;
    if (!isSlotAvailable) {
      const pendingCount = await prisma.reservation.count({
        where: {
          babyfootId: babyfootId,
          partyDate: reservationDate,
          status: "PENDING",
        },
      });
      queuePosition = pendingCount + 1;
    }

    // Create reservation with user as red defense (solo player)
    const reservationData: any = {
      babyfootId: babyfootId,
      partyDate: reservationDate,
      status: reservationStatus,
      format: format,
      redDefenseId: userId, // User who makes the reservation
    };

    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        babyfoot: true,
        redDefense: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Don't set OCCUPIED on CONFIRMED - only when game starts (IN_PROGRESS)
    // The babyfoot stays AVAILABLE until the player clicks "Démarrer"

    // Add to queue if PENDING
    if (reservationStatus === "PENDING") {
      await prisma.queueEntry.create({
        data: {
          userId: userId,
          babyfootId: babyfootId,
        },
      });
    }

    return Response.json(
      {
        success: true,
        data: reservation,
        queuePosition: queuePosition,
        message:
          reservationStatus === "CONFIRMED"
            ? "Réservation confirmée !"
            : `Ajouté à la file d'attente (position ${queuePosition})`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return Response.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}
