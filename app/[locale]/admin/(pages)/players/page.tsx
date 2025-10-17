"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdvancedDataTable } from "@/components/admin/advanced-data-table";
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog";
import { ServerPagination } from "@/components/admin/server-pagination";
import {
  PlayerStats,
  PlayerFilters,
  PlayerEmptyState,
  PlayerRoleDialog,
  getPlayerColumns,
  type Player,
} from "@/components/admin/players";
import { usePlayerFilters } from "@/hooks/use-player-filters";
import { usePlayerStats } from "@/hooks/use-player-stats";

export default function PlayersPage() {
  const t = useTranslations("user");
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Custom hooks for filtering and stats
  const { searchQuery, setSearchQuery, roleFilter, setRoleFilter } =
    usePlayerFilters(players);

  const stats = usePlayerStats(allPlayers); // Utiliser allPlayers pour les stats

  // Fetch all players for stats
  const fetchAllPlayers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats/users");
      const data = await response.json();
      if (data.success) {
        setAllPlayers(data.data);
      }
    } catch (error) {
      console.error("Error fetching all players for stats:", error);
    }
  }, []);

  // Fetch players from API (paginated)
  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=${pagination.limit}`
      );
      const data = await response.json();
      if (data.success) {
        setPlayers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error(t("playerDeletionError"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, pagination.limit, t]);

  useEffect(() => {
    fetchAllPlayers(); // Récupérer toutes les données pour les stats
    fetchPlayers(); // Récupérer les données paginées
  }, [fetchAllPlayers, fetchPlayers]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAllPlayers(), fetchPlayers()]);
  };

  const handleChangeRole = (player: Player) => {
    setSelectedPlayer(player);
    setIsRoleDialogOpen(true);
  };

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDeleteOpen(true);
  };

  const handleRoleSubmit = async (role: string) => {
    if (!selectedPlayer) return;

    try {
      const response = await fetch(
        `/api/admin/users/${selectedPlayer.id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(t("roleUpdated"));
        await fetchPlayers();
        setIsRoleDialogOpen(false);
      } else {
        toast.error(t("roleUpdateError"));
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(t("roleUpdateError"));
    }
  };

  const handleDelete = async () => {
    if (!selectedPlayer) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedPlayer.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t("playerDeleted"));
        await fetchPlayers();
        setIsDeleteOpen(false);
      } else {
        toast.error(t("playerDeletionError"));
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error(t("playerDeletionError"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({ ...prev, limit: newPageSize }));
    setPage(1); // Reset to first page when changing page size
  };

  // Define table columns
  const columns = getPlayerColumns({
    t,
    onChangeRole: handleChangeRole,
    onDelete: handleDeleteClick,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("pageDescription")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? t("refreshing") : t("refresh")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!isLoading && <PlayerStats stats={stats} />}

      {/* Filters and Search */}
      {!isLoading && allPlayers.length > 0 && (
        <PlayerFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
        />
      )}

      {/* Data Table or Empty State */}
      {!isLoading && allPlayers.length === 0 ? (
        <PlayerEmptyState />
      ) : (
        <div className="space-y-4">
          <AdvancedDataTable
            columns={columns}
            data={players}
            isLoading={isLoading}
            enablePagination={false}
          />
          {/* Server-side pagination */}
          <ServerPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemName={t("players")}
          />
        </div>
      )}

      {/* Role Change Dialog */}
      {selectedPlayer && (
        <PlayerRoleDialog
          open={isRoleDialogOpen}
          onOpenChange={setIsRoleDialogOpen}
          onSubmit={handleRoleSubmit}
          currentRole={selectedPlayer.role}
        />
      )}

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title={t("deletePlayerTitle")}
        description={t("deletePlayerDescription")}
        isLoading={isDeleting}
      />
    </div>
  );
}
