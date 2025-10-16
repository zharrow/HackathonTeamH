import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table2, Users, Calendar, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("admin");
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
            <div className="text-2xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground">
              {t("tablesAvailable")}
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
            <div className="text-2xl font-bold text-foreground">-</div>
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
            <div className="text-2xl font-bold text-foreground">-</div>
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
            <div className="text-2xl font-bold text-foreground">-</div>
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
