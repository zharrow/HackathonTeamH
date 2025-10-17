"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table2, Users, Calendar, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface AdminStats {
  tables: {
    total: number;
    available: number;
  };
  users: {
    total: number;
  };
  reservations: {
    total: number;
    active: number;
  };
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer les données des APIs existantes
        const [tablesResponse, usersResponse] = await Promise.all([
          fetch("/api/admin/tables"),
          fetch("/api/admin/users?limit=1000"), // Récupérer tous les utilisateurs
        ]);

        const [tablesData, usersData] = await Promise.all([
          tablesResponse.json(),
          usersResponse.json(),
        ]);

        if (tablesData.success && usersData.success) {
          // Calculer les statistiques
          const totalTables = tablesData.data.length;
          const availableTables = tablesData.data.filter(
            (table: { status: string }) => table.status === "AVAILABLE"
          ).length;
          const totalUsers = usersData.pagination.total;

          // Calculer les réservations totales depuis les tables
          const totalReservations = tablesData.data.reduce(
            (sum: number, table: { _count: { reservations: number } }) =>
              sum + table._count.reservations,
            0
          );

          setStats({
            tables: {
              total: totalTables,
              available: availableTables,
            },
            users: {
              total: totalUsers,
            },
            reservations: {
              total: totalReservations,
              active: 0, // On pourrait ajouter une API pour les réservations actives
            },
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboardTitle")}
          </h1>
          <p className="text-muted-foreground">{t("dashboardDescription")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("dashboardTitle")}
        </h1>
        <p className="text-muted-foreground">{t("dashboardDescription")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("tablesCount")}
            </CardTitle>
            <Table2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.tables.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.tables.available || 0} {t("tablesAvailable")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("usersCount")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.users.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("usersRegistered")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("reservationsCount")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.reservations.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("reservationsInProgress")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("statsTitle")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats
                ? Math.round(
                    (stats.tables.available / stats.tables.total) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {t("globalActivity")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            {t("welcomeAdminTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("welcomeAdminDescription")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              <strong>{t("tablesLink")}</strong> - {t("tablesDescription")}
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <strong>{t("playersLink")}</strong> - {t("playersDescription")}
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <strong>{t("reservationsLink")}</strong> -{" "}
              {t("reservationsDescription")}
            </li>
            <li className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <strong>{t("statsLink")}</strong> - {t("statsDescription")}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
