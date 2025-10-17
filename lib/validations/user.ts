import { z } from "zod";
import { Roles } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Roles),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
