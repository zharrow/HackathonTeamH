import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats/users
 * Get all users for statistics (no pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            reservationsAsRedDefense: true,
            reservationsAsRedAttack: true,
            reservationsAsBlueDefense: true,
            reservationsAsBlueAttack: true,
          },
        },
      },
    });

    return Response.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users for stats:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}
