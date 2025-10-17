"use client";

import { useTranslations } from "next-intl";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Reservation } from "./reservation-columns";

interface CalendarViewProps {
  reservations: Reservation[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: "day" | "week" | "month";
  onViewModeChange: (mode: "day" | "week" | "month") => void;
  onReservationClick?: (reservation: Reservation) => void;
}

export function CalendarView({
  reservations,
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  onReservationClick,
}: CalendarViewProps) {
  const t = useTranslations("reservation");

  // Navigation
  const goToPrevious = () => {
    if (viewMode === "day") {
      onDateChange(addDays(selectedDate, -1));
    } else if (viewMode === "week") {
      onDateChange(addDays(selectedDate, -7));
    } else if (viewMode === "month") {
      onDateChange(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
      );
    }
  };

  const goToNext = () => {
    if (viewMode === "day") {
      onDateChange(addDays(selectedDate, 1));
    } else if (viewMode === "week") {
      onDateChange(addDays(selectedDate, 7));
    } else if (viewMode === "month") {
      onDateChange(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
      );
    }
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="h-8 px-3 font-semibold hover:bg-primary/10"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-8 w-px bg-border" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {viewMode === "day"
                ? format(selectedDate, "EEEE, MMMM d, yyyy")
                : viewMode === "week"
                ? `Week of ${format(selectedDate, "MMM d, yyyy")}`
                : format(selectedDate, "MMMM yyyy")}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("day")}
              className="h-8 font-medium"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("week")}
              className="h-8 font-medium"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("month")}
              className="h-8 font-medium"
            >
              Month
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        {viewMode === "day" && (
          <DayView
            date={selectedDate}
            reservations={reservations}
            onReservationClick={onReservationClick}
          />
        )}
        {viewMode === "month" && (
          <MonthView
            date={selectedDate}
            reservations={reservations}
            onDateClick={onDateChange}
            onReservationClick={onReservationClick}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Day View Component
function DayView({
  date,
  reservations,
  onReservationClick,
}: {
  date: Date;
  reservations: Reservation[];
  onReservationClick?: (reservation: Reservation) => void;
}) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h
  const dayReservations = reservations.filter((r) =>
    isSameDay(parseISO(r.partyDate), date)
  );

  const colors = [
    "bg-gradient-to-r from-purple-500/30 to-purple-600/20 border-l-4 border-purple-500 shadow-lg shadow-purple-500/20",
    "bg-gradient-to-r from-blue-500/30 to-blue-600/20 border-l-4 border-blue-500 shadow-lg shadow-blue-500/20",
    "bg-gradient-to-r from-green-500/30 to-green-600/20 border-l-4 border-green-500 shadow-lg shadow-green-500/20",
    "bg-gradient-to-r from-orange-500/30 to-orange-600/20 border-l-4 border-orange-500 shadow-lg shadow-orange-500/20",
    "bg-gradient-to-r from-pink-500/30 to-pink-600/20 border-l-4 border-pink-500 shadow-lg shadow-pink-500/20",
  ];

  // Current time indicator
  const now = new Date();
  const isToday = isSameDay(date, now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const showTimeIndicator = isToday && currentHour >= 8 && currentHour <= 21;
  const timeIndicatorTop = (currentHour - 8) * 80 + (currentMinute / 60) * 80;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Time Grid */}
      <div className="space-y-0 bg-card">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex border-t border-border/50 first:border-t-0 hover:bg-muted/5 transition-colors"
            style={{ height: "80px" }}
          >
            <div className="w-16 flex-shrink-0 py-2 pr-4 text-right">
              <span className="text-sm font-medium text-muted-foreground">
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>
            <div className="flex-1 relative border-l border-border/50"></div>
          </div>
        ))}
      </div>

      {/* Current time indicator */}
      {showTimeIndicator && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-20"
          style={{ top: `${timeIndicatorTop}px` }}
        >
          <div className="flex items-center">
            <div className="w-16 flex items-center justify-end pr-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            </div>
            <div className="flex-1 h-0.5 bg-red-500 shadow-lg shadow-red-500/50" />
          </div>
        </div>
      )}

      {/* Reservations Overlay */}
      <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
        {dayReservations.map((reservation, idx) => {
          const resDate = parseISO(reservation.partyDate);
          const hour = resDate.getHours();
          const minute = resDate.getMinutes();
          const top = (hour - 8) * 80 + (minute / 60) * 80;
          const height = 80 * 1.5; // 1.5h par défaut

          return (
            <div
              key={reservation.id}
              className={cn(
                "absolute left-2 right-2 rounded-lg p-3 cursor-pointer pointer-events-auto hover:scale-[1.02] transition-all backdrop-blur-sm",
                colors[idx % colors.length]
              )}
              style={{
                top: `${top}px`,
                height: `${height}px`,
                zIndex: 10,
              }}
              onClick={() => onReservationClick?.(reservation)}
            >
              <div className="text-sm font-bold text-foreground">
                {reservation.babyfoot.name}
              </div>
              <div className="text-xs font-medium text-foreground/80 mt-1">
                {format(resDate, "HH:mm")}
              </div>
              {(reservation.redDefense || reservation.blueDefense) && (
                <div className="text-xs text-foreground/70 mt-1 line-clamp-1">
                  {[
                    reservation.redDefense?.name,
                    reservation.redAttack?.name,
                    reservation.blueDefense?.name,
                    reservation.blueAttack?.name,
                  ]
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({
  date,
  reservations,
  onDateClick,
  onReservationClick,
}: {
  date: Date;
  reservations: Reservation[];
  onDateClick: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
}) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const getReservationsForDay = (day: Date) => {
    return reservations.filter((r) => isSameDay(parseISO(r.partyDate), day));
  };

  return (
    <div className="space-y-2">
      {/* Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {rows.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIdx) => {
              const dayReservations = getReservationsForDay(day);
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "min-h-[100px] p-2 rounded-lg border transition-colors cursor-pointer hover:border-primary",
                    isCurrentMonth
                      ? "bg-card border-border"
                      : "bg-muted/30 border-transparent",
                    isToday && "ring-2 ring-primary"
                  )}
                  onClick={() => onDateClick(day)}
                >
                  <div
                    className={cn(
                      "text-sm font-semibold mb-1",
                      isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayReservations.slice(0, 2).map((reservation, idx) => {
                      const eventColors = [
                        "bg-purple-500/20 border-l-2 border-purple-500 hover:bg-purple-500/30",
                        "bg-blue-500/20 border-l-2 border-blue-500 hover:bg-blue-500/30",
                      ];
                      return (
                        <div
                          key={reservation.id}
                          className={cn(
                            "text-xs p-1.5 rounded truncate cursor-pointer transition-colors",
                            eventColors[idx % eventColors.length]
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReservationClick?.(reservation);
                          }}
                        >
                          <div className="font-bold text-foreground">
                            {format(parseISO(reservation.partyDate), "HH:mm")}
                          </div>
                          <div className="truncate text-foreground/80">
                            {reservation.babyfoot.name}
                          </div>
                        </div>
                      );
                    })}
                    {dayReservations.length > 2 && (
                      <div className="text-xs text-muted-foreground pl-1">
                        +{dayReservations.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
