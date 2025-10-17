import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createReservationSchema } from "@/lib/validations/reservation";

/**
 * GET /api/admin/reservations
 * List all reservations with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const babyfootId = searchParams.get("babyfootId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    // Calendar pagination parameters
    const viewMode = searchParams.get("viewMode") as
      | "day"
      | "week"
      | "month"
      | null;
    const currentDate = searchParams.get("currentDate");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (babyfootId) {
      where.babyfootId = babyfootId;
    }

    // Calendar pagination logic
    if (viewMode && currentDate) {
      const date = new Date(currentDate);
      let start, end;

      switch (viewMode) {
        case "day":
          start = new Date(date);
          start.setHours(0, 0, 0, 0);
          end = new Date(date);
          end.setHours(23, 59, 59, 999);
          break;
        case "week":
          // Get Monday of the week
          const dayOfWeek = date.getDay();
          const monday = new Date(date);
          monday.setDate(
            date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
          );
          start = new Date(monday);
          start.setHours(0, 0, 0, 0);
          // Get Sunday of the week
          end = new Date(monday);
          end.setDate(monday.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case "month":
          start = new Date(date.getFullYear(), date.getMonth(), 1);
          start.setHours(0, 0, 0, 0);
          end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
        default:
          break;
      }

      if (start && end) {
        where.partyDate = {
          gte: start,
          lte: end,
        };
      }
    } else if (startDate && endDate) {
      // Fallback to manual date range
      where.partyDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          babyfoot: true,
          referee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          redDefense: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          redAttack: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          blueDefense: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          blueAttack: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { partyDate: "desc" },
      }),
      prisma.reservation.count({ where }),
    ]);

    // Calculate date range info for calendar pagination
    let dateRange = null;
    if (viewMode && currentDate) {
      const date = new Date(currentDate);
      let start, end;

      switch (viewMode) {
        case "day":
          start = new Date(date);
          start.setHours(0, 0, 0, 0);
          end = new Date(date);
          end.setHours(23, 59, 59, 999);
          break;
        case "week":
          const dayOfWeek = date.getDay();
          const monday = new Date(date);
          monday.setDate(
            date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
          );
          start = new Date(monday);
          start.setHours(0, 0, 0, 0);
          end = new Date(monday);
          end.setDate(monday.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case "month":
          start = new Date(date.getFullYear(), date.getMonth(), 1);
          start.setHours(0, 0, 0, 0);
          end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
      }

      if (start && end) {
        dateRange = {
          start: start.toISOString(),
          end: end.toISOString(),
          viewMode,
          currentDate: currentDate,
        };
      }
    }

    return Response.json({
      success: true,
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      dateRange,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/reservations
 * Create a new reservation with queue system
 * - First to reserve a slot → CONFIRMED
 * - Others → PENDING (waiting list)
 * - Duration fixed at 15 minutes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createReservationSchema.parse(body);

    const partyDate = new Date(validated.partyDate);

    // Check if there's already a CONFIRMED reservation for this exact slot
    const confirmedReservation = await prisma.reservation.findFirst({
      where: {
        babyfootId: validated.babyfootId,
        partyDate: partyDate,
        status: "CONFIRMED",
      },
    });

    // Determine status: CONFIRMED if slot is free, PENDING if occupied
    const reservationStatus = confirmedReservation ? "PENDING" : "CONFIRMED";

    // Get queue position if PENDING
    let queuePosition = 0;
    if (reservationStatus === "PENDING") {
      const pendingCount = await prisma.reservation.count({
        where: {
          babyfootId: validated.babyfootId,
          partyDate: partyDate,
          status: "PENDING",
        },
      });
      queuePosition = pendingCount + 1;
    }

    const reservation = await prisma.reservation.create({
      data: {
        babyfootId: validated.babyfootId,
        partyDate: partyDate,
        status: reservationStatus,
        refereeId: validated.refereeId,
        redDefenseId: validated.redDefenseId,
        redAttackId: validated.redAttackId,
        blueDefenseId: validated.blueDefenseId,
        blueAttackId: validated.blueAttackId,
      },
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

    return Response.json(
      {
        success: true,
        data: reservation,
        queuePosition: reservationStatus === "PENDING" ? queuePosition : 0,
        message:
          reservationStatus === "CONFIRMED"
            ? "Réservation confirmée"
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
