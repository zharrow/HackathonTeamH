import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/users/:id
 * Get a single user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservationsAsRedDefense: true,
            reservationsAsRedAttack: true,
            reservationsAsBlueDefense: true,
            reservationsAsBlueAttack: true,
            queue: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: "Utilisateur supprimé",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error deleting user:", error);
    return Response.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}
