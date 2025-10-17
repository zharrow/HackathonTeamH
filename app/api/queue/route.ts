import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/queue
 * Get user's queue entries
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

    // Get user's queue entries
    const queueEntries = await prisma.queueEntry.findMany({
      where: {
        userId: userId,
        expiredAt: null, // Not expired
      },
      include: {
        babyfoot: {
          select: {
            id: true,
            name: true,
            location: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // For each queue entry, get the position in the queue
    const enrichedEntries = await Promise.all(
      queueEntries.map(async (entry) => {
        // Find user's pending reservation for this babyfoot
        const userReservation = await prisma.reservation.findFirst({
          where: {
            babyfootId: entry.babyfootId,
            status: "PENDING",
            redDefenseId: userId,
          },
          orderBy: {
            partyDate: "asc",
          },
        });

        if (!userReservation) {
          return {
            ...entry,
            queuePosition: null,
            estimatedWaitTime: null,
          };
        }

        // Count how many reservations are ahead in the queue for this time slot
        const aheadInQueue = await prisma.reservation.count({
          where: {
            babyfootId: entry.babyfootId,
            partyDate: userReservation.partyDate,
            status: "PENDING",
            createdAt: {
              lt: userReservation.createdAt,
            },
          },
        });

        const queuePosition = aheadInQueue + 1;

        // Estimate wait time (15 minutes per game * position)
        const estimatedWaitTime = queuePosition * 15;

        return {
          ...entry,
          queuePosition,
          estimatedWaitTime,
          reservationTime: userReservation.partyDate,
        };
      })
    );

    return Response.json({
      success: true,
      data: enrichedEntries,
    });
  } catch (error) {
    console.error("Error fetching queue:", error);
    return Response.json(
      { error: "Erreur lors de la récupération de la file d'attente" },
      { status: 500 }
    );
  }
}
