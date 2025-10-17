import { useMemo } from "react";
import { Player } from "@/components/admin/players/player-columns";

export function usePlayerStats(players: Player[]) {
  return useMemo(() => {
    const totalGames = players.reduce(
      (sum, p) => sum + p.wins + p.losses + p.draws,
      0
    );
    const totalElo = players.reduce((sum, p) => sum + p.elo, 0);

    return {
      total: players.length,
      admins: players.filter((p) => p.role === "ADMIN").length,
      totalGames,
      avgElo: players.length > 0 ? totalElo / players.length : 0,
    };
  }, [players]);
}
