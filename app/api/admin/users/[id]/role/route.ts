import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserRoleSchema } from "@/lib/validations/user";

/**
 * PATCH /api/admin/users/:id/role
 * Update user role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validated = updateUserRoleSchema.parse(body);

    const user = await prisma.user.update({
      where: { id },
      data: { role: validated.role },
    });

    return Response.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error updating user role:", error);
    return Response.json(
      { error: "Erreur lors de la mise à jour du rôle" },
      { status: 500 }
    );
  }
}
