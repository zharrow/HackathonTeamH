import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table2, Users, Calendar, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de la plateforme Babyfoot Booking
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tables de Babyfoot
            </CardTitle>
            <Table2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground">Tables disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground">Joueurs inscrits</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground">Parties en cours</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Statistiques
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground">Activité globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            Bienvenue dans l&apos;administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Utilisez la sidebar pour naviguer entre les différentes sections :
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              <strong>Tables de Babyfoot</strong> - Gérer les tables disponibles
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <strong>Joueurs</strong> - Voir et gérer les utilisateurs
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <strong>Réservations</strong> - Suivre les parties en cours
            </li>
            <li className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <strong>Statistiques</strong> - Analyser l&apos;activité
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
