import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTableSchema } from "@/lib/validations/table";

/**
 * GET /api/admin/tables
 * List all babyfoot tables with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // Si pas de pagination demandée, retourner toutes les données
    if (!page || !limit) {
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ];
      }

      if (status && status !== "ALL") {
        where.status = status;
      }

      const tables = await prisma.babyfoot.findMany({
        where,
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
    }

    // Pagination demandée
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { location: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [tables, total] = await Promise.all([
      prisma.babyfoot.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          _count: {
            select: {
              reservations: true,
              queue: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.babyfoot.count({ where }),
    ]);

    return Response.json({
      success: true,
      data: tables,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
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
