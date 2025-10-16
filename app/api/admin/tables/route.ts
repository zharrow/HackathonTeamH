import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createTableSchema } from "@/lib/validations/table";

/**
 * GET /api/admin/tables
 * List all babyfoot tables
 */
export async function GET() {
  try {
    await requireAdmin();

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

    return Response.json({ success: true, data: tables });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error fetching tables:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des tables" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tables
 * Create a new babyfoot table
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validated = createTableSchema.parse(body);

    const table = await prisma.babyfoot.create({
      data: {
        name: validated.name,
        location: validated.location,
        condition: validated.condition,
        status: validated.status || "AVAILABLE",
      },
    });

    return Response.json({ success: true, data: table }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Accès non autorisé" }, { status: 403 });
    }
    console.error("Error creating table:", error);
    return Response.json(
      { error: "Erreur lors de la création de la table" },
      { status: 500 }
    );
  }
}
