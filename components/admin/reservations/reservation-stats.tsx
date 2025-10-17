"use client";

import { useTranslations } from "next-intl";
import { Calendar, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReservationStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

export function ReservationStats({ stats }: ReservationStatsProps) {
  const t = useTranslations("reservation");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalReservations")}
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All time bookings
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("activeReservations")}
          </CardTitle>
          <PlayCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.active / stats.total) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("completedReservations")}
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {stats.completed}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Successfully finished
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("cancelledReservations")}
          </CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {stats.cancelled}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.cancelled / stats.total) * 100) || 0}% cancelled
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
