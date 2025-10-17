"use client";

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
  if (isLoading) {
    return null;
  }

  return <ReservationStats stats={stats} />;
}
