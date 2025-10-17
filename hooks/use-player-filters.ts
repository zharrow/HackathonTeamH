import { useMemo, useState } from "react";
import { Player } from "@/components/admin/players/player-columns";

export function usePlayerFilters(players: Player[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by role
      const matchesRole = roleFilter === "ALL" || player.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [players, searchQuery, roleFilter]);

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredPlayers,
  };
}
