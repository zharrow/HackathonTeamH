import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats/reservations
 * Get all reservations for statistics (no pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const reservations = await prisma.reservation.findMany({
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
    });

    return Response.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("Error fetching reservations for stats:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}
