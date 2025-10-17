import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats/tables
 * Get all tables for statistics (no pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const tables = await prisma.babyfoot.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
            queue: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return Response.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.error("Error fetching tables for stats:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des tables" },
      { status: 500 }
    );
  }
}
