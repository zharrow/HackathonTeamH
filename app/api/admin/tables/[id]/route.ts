import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTableSchema } from "@/lib/validations/table";

/**
 * GET /api/admin/tables/:id
 * Get a single babyfoot table
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const table = await prisma.babyfoot.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: true,
            queue: true,
          },
        },
      },
    });

    if (!table) {
      return Response.json({ error: "Table non trouvée" }, { status: 404 });
    }

    return Response.json({ success: true, data: table });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error fetching table:", error);
    return Response.json(
      { error: "Erreur lors de la récupération de la table" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/tables/:id
 * Update a babyfoot table
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validated = updateTableSchema.parse(body);

    const table = await prisma.babyfoot.update({
      where: { id },
      data: validated,
    });

    return Response.json({ success: true, data: table });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error updating table:", error);
    return Response.json(
      { error: "Erreur lors de la mise à jour de la table" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tables/:id
 * Delete a babyfoot table
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.babyfoot.delete({
      where: { id },
    });

    return Response.json({ success: true, message: "Table supprimée" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error deleting table:", error);
    return Response.json(
      { error: "Erreur lors de la suppression de la table" },
      { status: 500 }
    );
  }
}
