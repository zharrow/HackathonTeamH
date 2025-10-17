"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Trophy, Target, Clock } from "lucide-react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface UserStatsProps {
  user?: {
    nickname: string;
    elo: number;
    wins: number;
    losses: number;
    totalGames: number;
    averageGameDuration: number;
  };
}

// Données mockées pour la progression ELO
const eloProgressionData = [
  { date: "Sem 1", elo: 1000 },
  { date: "Sem 2", elo: 1050 },
  { date: "Sem 3", elo: 1120 },
  { date: "Sem 4", elo: 1180 },
  { date: "Sem 5", elo: 1150 },
  { date: "Sem 6", elo: 1220 },
  { date: "Sem 7", elo: 1280 },
  { date: "Sem 8", elo: 1320 },
];

// Données mockées pour les formats de match
const matchFormatsData = [
  { format: "1v1", games: 15 },
  { format: "1v2", games: 8 },
  { format: "2v2", games: 22 },
];

// Configuration des couleurs pour les graphiques
const chartConfig = {
  elo: {
    label: "ELO",
    color: "hsl(189, 94%, 54%)", // cyan
  },
  games: {
    label: "Parties",
    color: "hsl(328, 86%, 60%)", // magenta
  },
};

export function UserStats({ user }: UserStatsProps) {
  // Données mockées si aucun utilisateur n'est fourni
  const userData = user || {
    nickname: "Joueur",
    elo: 1320,
    wins: 28,
    losses: 17,
    totalGames: 45,
    averageGameDuration: 12.5,
  };

  const winRate = Math.round((userData.wins / userData.totalGames) * 100);

  return (
    <div className="space-y-6">
      {/* En-tête des statistiques */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500 mb-2">
          Vos Statistiques
        </h2>
        <p className="text-gray-400">
          Suivez votre progression et vos performances
        </p>
      </div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ELO */}
        <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              Score ELO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {userData.elo}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +120 ce mois
            </p>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="border-green-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              Taux de victoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{winRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {userData.wins}V - {userData.losses}D
            </p>
          </CardContent>
        </Card>

        {/* Total Parties */}
        <Card className="border-magenta-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-magenta-400" />
              Parties jouées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-magenta-400">
              {userData.totalGames}
            </div>
            <p className="text-xs text-gray-500 mt-1">Au total</p>
          </CardContent>
        </Card>

        {/* Durée moyenne */}
        <Card className="border-yellow-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              Durée moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {userData.averageGameDuration} min
            </div>
            <p className="text-xs text-gray-500 mt-1">Par partie</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression ELO */}
        <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">
              Progression ELO
            </CardTitle>
            <CardDescription className="text-gray-400">
              Évolution de votre score sur les 8 dernières semaines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={eloProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                  domain={[900, 1400]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="elo"
                  stroke="hsl(189, 94%, 54%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(189, 94%, 54%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Formats de match */}
        <Card className="border-magenta-500/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">
              Formats de match
            </CardTitle>
            <CardDescription className="text-gray-400">
              Répartition de vos parties par format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={matchFormatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="format"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="games"
                  fill="hsl(328, 86%, 60%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historique récent */}
      <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">
            Dernières parties
          </CardTitle>
          <CardDescription className="text-gray-400">
            Vos 5 derniers matchs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                date: "Aujourd'hui 14:30",
                format: "2v2",
                result: "Victoire",
                eloChange: "+24",
              },
              {
                date: "Hier 16:45",
                format: "1v1",
                result: "Défaite",
                eloChange: "-18",
              },
              {
                date: "Hier 12:15",
                format: "2v2",
                result: "Victoire",
                eloChange: "+22",
              },
              {
                date: "15 Oct 17:00",
                format: "1v2",
                result: "Victoire",
                eloChange: "+28",
              },
              {
                date: "15 Oct 10:30",
                format: "1v1",
                result: "Défaite",
                eloChange: "-16",
              },
            ].map((game, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      game.result === "Victoire" ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {game.format}
                    </p>
                    <p className="text-xs text-gray-500">{game.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium ${
                      game.result === "Victoire"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {game.result}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      game.eloChange.startsWith("+")
                        ? "text-cyan-400"
                        : "text-red-400"
                    }`}
                  >
                    {game.eloChange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
