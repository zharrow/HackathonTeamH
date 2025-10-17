import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/reservations/queues
 * Get all pending reservations grouped by table and slot
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const babyfootId = searchParams.get("babyfootId") || undefined;

    // Get all PENDING reservations
    const pendingReservations = await prisma.reservation.findMany({
      where: {
        status: "PENDING",
        ...(babyfootId && { babyfootId }),
      },
      orderBy: [
        { partyDate: "asc" },
        { createdAt: "asc" }, // First in queue
      ],
      include: {
        babyfoot: {
          select: { name: true, location: true },
        },
        redDefense: { select: { name: true, image: true } },
        redAttack: { select: { name: true, image: true } },
        blueDefense: { select: { name: true, image: true } },
        blueAttack: { select: { name: true, image: true } },
        referee: { select: { name: true, image: true } },
      },
    });

    // Group by table and time slot
    const groupedQueues: Record<string, Record<string, any[]>> = {};

    pendingReservations.forEach((reservation) => {
      const tableKey = reservation.babyfootId;
      const slotKey = reservation.partyDate.toISOString();

      if (!groupedQueues[tableKey]) {
        groupedQueues[tableKey] = {};
      }

      if (!groupedQueues[tableKey][slotKey]) {
        groupedQueues[tableKey][slotKey] = [];
      }

      groupedQueues[tableKey][slotKey].push(reservation);
    });

    // Format response
    const queues = Object.entries(groupedQueues).map(([tableId, slots]) => {
      return {
        babyfootId: tableId,
        babyfootName: pendingReservations.find((r) => r.babyfootId === tableId)
          ?.babyfoot.name,
        slots: Object.entries(slots).map(([slotTime, reservations]) => ({
          time: slotTime,
          queueLength: reservations.length,
          reservations: reservations.map((r, index) => ({
            ...r,
            queuePosition: index + 1,
          })),
        })),
      };
    });

    return Response.json({
      success: true,
      data: queues,
      totalPending: pendingReservations.length,
    });
  } catch (error) {
    console.error("Error fetching queues:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des files d'attente" },
      { status: 500 }
    );
  }
}
