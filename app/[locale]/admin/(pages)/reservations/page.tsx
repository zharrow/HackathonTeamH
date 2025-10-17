"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdvancedDataTable } from "@/components/admin/advanced-data-table";
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog";
import {
  ReservationStats,
  ReservationFilters,
  ReservationEmptyState,
  ReservationFormDialog,
  BabyfootCard,
  CalendarView,
  getReservationColumns,
  type Reservation,
} from "@/components/admin/reservations";

interface BabyfootTable {
  id: string;
  name: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  location?: string;
  _count?: {
    reservations: number;
  };
}

interface Player {
  id: string;
  name: string;
}

export default function ReservationsPage() {
  const params = useParams();
  const t = useTranslations("reservation");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<BabyfootTable[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("ALL");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState<
    "day" | "week" | "month"
  >("month");

  // Fetch data
  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/reservations");
      const data = await response.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error(t("reservationDeletionError"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/tables");
      const data = await response.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users?limit=1000");
      const data = await response.json();
      if (data.success) {
        setPlayers(data.data.map((u: any) => ({ id: u.id, name: u.name })));
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchTables();
    fetchPlayers();
  }, [fetchReservations, fetchTables, fetchPlayers]);

  // Auto-refresh reservations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReservations();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchReservations]);

  // Filter reservations (only by dropdown for table view)
  const filteredReservations = useMemo(() => {
    if (selectedTable === "ALL") {
      return reservations;
    }
    return reservations.filter((r) => r.babyfoot.id === selectedTable);
  }, [reservations, selectedTable]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      active: reservations.filter((r) =>
        ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(r.status)
      ).length,
      completed: reservations.filter((r) => r.status === "FINISHED").length,
      cancelled: reservations.filter((r) =>
        ["CANCELLED", "EXPIRED"].includes(r.status)
      ).length,
    };
  }, [reservations]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReservations();
  };

  const handleCreate = () => {
    setSelectedReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDeleteOpen(true);
  };

  const handleReservationClick = (reservation: Reservation) => {
    handleEdit(reservation);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url = selectedReservation
        ? `/api/admin/reservations/${selectedReservation.id}`
        : "/api/admin/reservations";

      const method = selectedReservation ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Show appropriate message based on queue status
        if (!selectedReservation && result.queuePosition > 0) {
          toast.success(
            `${t("addedToQueue")} (${t("queuePosition")}: ${
              result.queuePosition
            })`
          );
        } else {
          toast.success(
            selectedReservation
              ? t("reservationUpdated")
              : t("reservationConfirmed")
          );
        }
        await fetchReservations();
        setIsFormOpen(false);
      } else if (response.status === 409) {
        toast.error(t("conflictError"));
      } else {
        toast.error(
          selectedReservation
            ? t("reservationUpdateError")
            : t("reservationCreationError")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        selectedReservation
          ? t("reservationUpdateError")
          : t("reservationCreationError")
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedReservation) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/reservations/${selectedReservation.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(t("reservationDeleted"));
        await fetchReservations();
        setIsDeleteOpen(false);
      } else {
        toast.error(t("reservationDeletionError"));
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error(t("reservationDeletionError"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Define table columns
  const columns = getReservationColumns({
    t,
    onEdit: handleEdit,
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
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-refresh activé (30s)
          </p>
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
          <Link href={`/${params.locale}/admin/reservations/queues`}>
            <Button variant="outline" size="sm" className="gap-2">
              👥 {t("viewQueues")}
            </Button>
          </Link>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addReservation")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!isLoading && <ReservationStats stats={stats} />}

      {/* Babyfoot Cards - NEW */}
      {!isLoading && tables.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("selectTable")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("selectTableDescription")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => (
              <BabyfootCard
                key={table.id}
                table={table}
                reservationCount={table._count?.reservations || 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Calendar View - NEW - Shows ALL reservations */}
      {!isLoading && reservations.length > 0 && (
        <CalendarView
          reservations={reservations}
          selectedDate={calendarDate}
          onDateChange={setCalendarDate}
          viewMode={calendarViewMode}
          onViewModeChange={setCalendarViewMode}
          onReservationClick={handleReservationClick}
        />
      )}

      {/* Filters */}
      {!isLoading && reservations.length > 0 && (
        <ReservationFilters
          tables={tables}
          selectedTable={selectedTable}
          onTableChange={setSelectedTable}
        />
      )}

      {/* Data Table or Empty State */}
      {!isLoading && reservations.length === 0 ? (
        <ReservationEmptyState onCreate={handleCreate} />
      ) : (
        <AdvancedDataTable
          columns={columns}
          data={filteredReservations}
          isLoading={isLoading}
        />
      )}

      {/* Create/Edit Dialog */}
      <ReservationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={
          selectedReservation
            ? {
                babyfootId: selectedReservation.babyfoot.id,
                partyDate: selectedReservation.partyDate,
                refereeId: selectedReservation.referee?.id,
                redDefenseId: selectedReservation.redDefense?.id,
                redAttackId: selectedReservation.redAttack?.id,
                blueDefenseId: selectedReservation.blueDefense?.id,
                blueAttackId: selectedReservation.blueAttack?.id,
              }
            : undefined
        }
        title={
          selectedReservation
            ? t("editReservationTitle")
            : t("addReservationTitle")
        }
        description={
          selectedReservation
            ? t("editReservationDescription")
            : t("addReservationDescription")
        }
        tables={tables}
        players={players}
      />

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title={t("deleteReservationTitle")}
        description={t("deleteReservationDescription")}
        isLoading={isDeleting}
      />
    </div>
  );
}
