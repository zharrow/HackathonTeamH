"use client";

import { useTranslations } from "next-intl";
import { AdvancedDataTable } from "@/components/admin/advanced-data-table";
import { ServerPagination } from "@/components/admin/server-pagination";
import { ReservationEmptyState } from "./reservation-empty-state";
import { getReservationColumns } from "./reservation-columns";

interface Reservation {
  id: string;
  partyDate: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "FINISHED"
    | "CANCELLED"
    | "EXPIRED";
  babyfoot: {
    id: string;
    name: string;
  };
  referee?: {
    id: string;
    name: string;
  } | null;
  redDefense?: {
    id: string;
    name: string;
  } | null;
  redAttack?: {
    id: string;
    name: string;
  } | null;
  blueDefense?: {
    id: string;
    name: string;
  } | null;
  blueAttack?: {
    id: string;
    name: string;
  } | null;
}

interface ReservationsTableSectionProps {
  reservations: Reservation[];
  allReservations: Reservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
  onCreate: () => void;
  isLoading: boolean;
}

export function ReservationsTableSection({
  reservations,
  allReservations,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onCreate,
  isLoading,
}: ReservationsTableSectionProps) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const columns = getReservationColumns({
    t,
    onEdit,
    onDelete,
  });

  if (isLoading && allReservations.length === 0) {
    return null;
  }

  if (!isLoading && allReservations.length === 0) {
    return <ReservationEmptyState onCreate={onCreate} />;
  }

  return (
    <div className="space-y-4">
      <AdvancedDataTable
        columns={columns}
        data={reservations}
        isLoading={isLoading}
        enablePagination={false}
      />
      <ServerPagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        itemName={tCommon("reservations")}
      />
    </div>
  );
}
