"use client";

import { useTranslations } from "next-intl";
import { Table2, CheckCircle, AlertCircle, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableStatsProps {
  stats: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    totalReservations: number;
    totalQueue: number;
  };
}

export function TableStats({ stats }: TableStatsProps) {
  const t = useTranslations("table");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalTables")}
          </CardTitle>
          <Table2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalReservations} {t("reservations").toLowerCase()}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("available")}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {stats.available}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.available / stats.total) * 100) || 0}%{" "}
            {t("available_percent")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("occupied")}
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">
            {stats.occupied}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalQueue} {t("queueLowercase")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("maintenance")}
          </CardTitle>
          <Wrench className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {stats.maintenance}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("needsAttention")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
