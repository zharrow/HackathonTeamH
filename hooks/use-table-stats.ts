import { useMemo } from "react";
import { BabyfootTable } from "@/components/admin/tables/table-columns";

export function useTableStats(tables: BabyfootTable[]) {
  return useMemo(
    () => ({
      total: tables.length,
      available: tables.filter((t) => t.status === "AVAILABLE").length,
      occupied: tables.filter((t) => t.status === "OCCUPIED").length,
      maintenance: tables.filter((t) => t.status === "MAINTENANCE").length,
      totalReservations: tables.reduce(
        (sum, t) => sum + t._count.reservations,
        0
      ),
      totalQueue: tables.reduce((sum, t) => sum + t._count.queue, 0),
    }),
    [tables]
  );
}
