"use client";

import { ReservationFilters } from "./reservation-filters";

interface BabyfootTable {
  id: string;
  name: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  location?: string;
}

interface ReservationsFiltersSectionProps {
  tables: BabyfootTable[];
  selectedTable: string;
  onTableChange: (value: string) => void;
  reservations: unknown[];
  isLoading: boolean;
}

export function ReservationsFiltersSection({
  tables,
  selectedTable,
  onTableChange,
  reservations,
  isLoading,
}: ReservationsFiltersSectionProps) {
  if (isLoading || reservations.length === 0) {
    return null;
  }

  return (
    <ReservationFilters
      tables={tables}
      selectedTable={selectedTable}
      onTableChange={onTableChange}
    />
  );
}
