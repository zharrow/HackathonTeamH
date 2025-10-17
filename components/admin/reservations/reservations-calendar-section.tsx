"use client";

import { CalendarView } from "./calendar-view";

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

interface ReservationsCalendarSectionProps {
  calendarReservations: Reservation[];
  calendarDate: Date;
  onCalendarDateChange: (date: Date) => void;
  calendarViewMode: "day" | "week" | "month";
  onCalendarViewModeChange: (mode: "day" | "week" | "month") => void;
  onReservationClick?: (reservation: Reservation) => void;
  isLoading: boolean;
}

export function ReservationsCalendarSection({
  calendarReservations,
  calendarDate,
  onCalendarDateChange,
  calendarViewMode,
  onCalendarViewModeChange,
  onReservationClick,
  isLoading,
}: ReservationsCalendarSectionProps) {
  if (isLoading) {
    return null;
  }

  return (
    <CalendarView
      reservations={calendarReservations}
      selectedDate={calendarDate}
      onDateChange={onCalendarDateChange}
      viewMode={calendarViewMode}
      onViewModeChange={onCalendarViewModeChange}
      onReservationClick={onReservationClick}
    />
  );
}
