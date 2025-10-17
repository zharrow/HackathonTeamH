"use client";

import { useTranslations } from "next-intl";
import { ReservationStats } from "./reservation-stats";

interface ReservationsStatsSectionProps {
  stats: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  isLoading: boolean;
}

export function ReservationsStatsSection({
  stats,
  isLoading,
}: ReservationsStatsSectionProps) {
  const t = useTranslations("reservation");

  if (isLoading) {
    return null;
  }

  return <ReservationStats stats={stats} />;
}
