import { z } from "zod";
import { Roles } from "@/generated/prisma";

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Roles),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
