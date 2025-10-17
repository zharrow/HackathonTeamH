"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartConfig } from "@/components/ui/chart";

interface StatsData {
  reservations: {
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  tables: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
  };
  players: {
    total: number;
    admins: number;
    users: number;
  };
  dailyReservations: Array<{
    date: string;
    confirmed: number;
    pending: number;
    completed: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    reservations: number;
    players: number;
  }>;
}

export default function StatsPage() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [reservationsRes, tablesRes, playersRes] = await Promise.all([
          fetch("/api/admin/reservations"),
          fetch("/api/admin/tables"),
          fetch("/api/admin/users?limit=1000"),
        ]);

        const [reservationsData, tablesData, playersData] = await Promise.all([
          reservationsRes.json(),
          tablesRes.json(),
          playersRes.json(),
        ]);

        if (
          reservationsData.success &&
          tablesData.success &&
          playersData.success
        ) {
          const reservations = reservationsData.data;
          const tables = tablesData.data;
          const players = playersData.data;

          // Calculate stats
          const reservationStats = {
            total: reservations.length,
            confirmed: reservations.filter((r: any) => r.status === "CONFIRMED")
              .length,
            pending: reservations.filter((r: any) => r.status === "PENDING")
              .length,
            completed: reservations.filter((r: any) => r.status === "FINISHED")
              .length,
            cancelled: reservations.filter((r: any) =>
              ["CANCELLED", "EXPIRED"].includes(r.status)
            ).length,
          };

          const tableStats = {
            total: tables.length,
            available: tables.filter((t: any) => t.status === "AVAILABLE")
              .length,
            occupied: tables.filter((t: any) => t.status === "OCCUPIED").length,
            maintenance: tables.filter((t: any) => t.status === "MAINTENANCE")
              .length,
          };

          const playerStats = {
            total: players.length,
            admins: players.filter((p: any) => p.role === "ADMIN").length,
            users: players.filter((p: any) => p.role === "USER").length,
          };

          // Generate mock daily data for the last 7 days
          const dailyReservations = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              }),
              confirmed: Math.floor(Math.random() * 10) + 5,
              pending: Math.floor(Math.random() * 5) + 1,
              completed: Math.floor(Math.random() * 8) + 3,
            };
          });

          // Generate mock weekly activity
          const weeklyActivity = [
            { day: "Lun", reservations: 12, players: 8 },
            { day: "Mar", reservations: 15, players: 10 },
            { day: "Mer", reservations: 18, players: 12 },
            { day: "Jeu", reservations: 22, players: 15 },
            { day: "Ven", reservations: 25, players: 18 },
            { day: "Sam", reservations: 20, players: 14 },
            { day: "Dim", reservations: 16, players: 11 },
          ];

          setStats({
            reservations: reservationStats,
            tables: tableStats,
            players: playerStats,
            dailyReservations,
            weeklyActivity,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartConfig = {
    confirmed: {
      label: "Confirmées",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "En attente",
      color: "hsl(var(--chart-2))",
    },
    completed: {
      label: "Terminées",
      color: "hsl(var(--chart-3))",
    },
    reservations: {
      label: "Réservations",
      color: "hsl(var(--chart-1))",
    },
    players: {
      label: "Joueurs",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Erreur lors du chargement des statistiques
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de l'activité du babyfoot
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <div className="text-2xl">📅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservations.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reservations.confirmed} confirmées,{" "}
              {stats.reservations.pending} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <div className="text-2xl">🏓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tables.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tables.available} disponibles, {stats.tables.occupied}{" "}
              occupées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joueurs</CardTitle>
            <div className="text-2xl">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.players.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.players.users} utilisateurs, {stats.players.admins} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d'occupation
            </CardTitle>
            <div className="text-2xl">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.tables.occupied / stats.tables.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tables actuellement occupées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Reservations Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations des 7 derniers jours</CardTitle>
            <CardDescription>
              Évolution des réservations par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailyReservations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="confirmed"
                  stackId="1"
                  stroke={chartConfig.confirmed.color}
                  fill={chartConfig.confirmed.color}
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke={chartConfig.pending.color}
                  fill={chartConfig.pending.color}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke={chartConfig.completed.color}
                  fill={chartConfig.completed.color}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activité hebdomadaire</CardTitle>
            <CardDescription>
              Réservations et joueurs par jour de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="reservations"
                  fill={chartConfig.reservations.color}
                />
                <Bar dataKey="players" fill={chartConfig.players.color} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des statuts</CardTitle>
          <CardDescription>
            Distribution des réservations par statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">
                Confirmées: {stats.reservations.confirmed}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">
                En attente: {stats.reservations.pending}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                Terminées: {stats.reservations.completed}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">
                Annulées: {stats.reservations.cancelled}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
