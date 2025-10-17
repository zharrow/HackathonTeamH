"use client";

import { useTranslations } from "next-intl";
import { Users, Shield, Gamepad2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerStatsProps {
  stats: {
    total: number;
    admins: number;
    totalGames: number;
    avgElo: number;
  };
}

export function PlayerStats({ stats }: PlayerStatsProps) {
  const t = useTranslations("user");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalPlayers")}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalGames} {t("gamesPlayed")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("admins")}
          </CardTitle>
          <Shield className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {stats.admins}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.admins / stats.total) * 100) || 0}% admins
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalGames")}
          </CardTitle>
          <Gamepad2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {stats.totalGames}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0 ? Math.round(stats.totalGames / stats.total) : 0}{" "}
            per player
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("avgElo")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {Math.round(stats.avgElo)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Average rating</p>
        </CardContent>
      </Card>
    </div>
  );
}
