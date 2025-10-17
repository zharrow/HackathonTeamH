import { prisma } from "@/lib/prisma";

/**
 * GET /api/users
 * Get list of users for player selection
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return Response.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}
