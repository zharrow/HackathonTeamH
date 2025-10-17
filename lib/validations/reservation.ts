import { z } from "zod";
import { ReservationStatus } from "@prisma/client";

export const createReservationSchema = z.object({
  babyfootId: z.string().uuid(),
  partyDate: z.string().datetime(),
  refereeId: z.string().uuid().optional().nullable(),
  redDefenseId: z.string().uuid().optional().nullable(),
  redAttackId: z.string().uuid().optional().nullable(),
  blueDefenseId: z.string().uuid().optional().nullable(),
  blueAttackId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(ReservationStatus).optional(),
});

export const updateReservationSchema = z.object({
  babyfootId: z.string().uuid().optional(),
  partyDate: z.string().datetime().optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
  refereeId: z.string().uuid().optional().nullable(),
  redDefenseId: z.string().uuid().optional().nullable(),
  redAttackId: z.string().uuid().optional().nullable(),
  blueDefenseId: z.string().uuid().optional().nullable(),
  blueAttackId: z.string().uuid().optional().nullable(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
