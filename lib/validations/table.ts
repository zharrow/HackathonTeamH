import { z } from "zod";
import { BabyfootStatus, TableCondition } from "@/generated/prisma";

export const createTableSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  location: z.string().optional(),
  condition: z.nativeEnum(TableCondition).optional(),
  status: z.nativeEnum(BabyfootStatus).optional(),
});

export const updateTableSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100).optional(),
  location: z.string().optional(),
  condition: z.nativeEnum(TableCondition).optional(),
  status: z.nativeEnum(BabyfootStatus).optional(),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
