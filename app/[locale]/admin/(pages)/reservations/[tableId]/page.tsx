"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog";
import {
  CalendarView,
  ReservationFormDialog,
  type Reservation,
} from "@/components/admin/reservations";

interface ReservationFormData {
  babyfootId: string;
  partyDate: string;
  refereeId?: string | null;
  redDefenseId?: string | null;
  redAttackId?: string | null;
  blueDefenseId?: string | null;
  blueAttackId?: string | null;
}
import Link from "next/link";

interface BabyfootTable {
  id: string;
  name: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  location?: string;
}

interface Player {
  id: string;
  name: string;
}

export default function TableReservationsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const tableId = params.tableId as string;
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const [table, setTable] = useState<BabyfootTable | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState<
    "day" | "week" | "month"
  >("month");

  // Fetch table details
  const fetchTable = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/tables/${tableId}`);
      const data = await response.json();
      if (data.success) {
        setTable(data.data);
      } else {
        toast.error("Table not found");
        router.push(`/${locale}/admin/reservations`);
      }
    } catch (error) {
      console.error("Error fetching table:", error);
      toast.error("Error loading table");
    }
  }, [tableId, locale, router]);

  // Fetch reservations for this table
  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/reservations?babyfootId=${tableId}`
      );
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
  }, [tableId, t]);

  // Fetch players
  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users?limit=1000");
      const data = await response.json();
      if (data.success) {
        setPlayers(
          data.data.map((u: { id: string; name: string }) => ({
            id: u.id,
            name: u.name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  }, []);

  useEffect(() => {
    fetchTable();
    fetchReservations();
    fetchPlayers();
  }, [fetchTable, fetchReservations, fetchPlayers]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTable(), fetchReservations()]);
  };

  const handleCreate = () => {
    setSelectedReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsFormOpen(true);
  };

  const handleReservationClick = (reservation: Reservation) => {
    handleEdit(reservation);
  };

  const handleFormSubmit = async (data: ReservationFormData) => {
    try {
      // Force the tableId for new reservations
      const submissionData = { ...data, babyfootId: tableId };

      const url = selectedReservation
        ? `/api/admin/reservations/${selectedReservation.id}`
        : "/api/admin/reservations";

      const method = selectedReservation ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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

  const statusConfig = {
    AVAILABLE: {
      color: "text-green-500",
      bg: "bg-green-500/10",
      label: "Available",
    },
    OCCUPIED: {
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      label: "Occupied",
    },
    MAINTENANCE: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Maintenance",
    },
  };

  if (isLoading || !table) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const config = statusConfig[table.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link href={`/${locale}/admin/reservations`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {tCommon("back")}
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {table.name}
              </h1>
              <Badge
                variant={table.status === "AVAILABLE" ? "default" : "secondary"}
                className={config.color}
              >
                {config.label}
              </Badge>
            </div>
            {table.location && (
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                {table.location}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {reservations.length}{" "}
              {reservations.length === 1 ? "réservation" : "réservations"}
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
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addReservation")}
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar View for this table */}
      {reservations.length > 0 ? (
        <CalendarView
          reservations={reservations}
          selectedDate={calendarDate}
          onDateChange={setCalendarDate}
          viewMode={calendarViewMode}
          onViewModeChange={setCalendarViewMode}
          onReservationClick={handleReservationClick}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-lg">
          <div className="text-center space-y-4">
            <div className="text-6xl">📅</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("noReservations")}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t("emptyStateMessage")}
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addReservation")}
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ReservationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={
          selectedReservation
            ? {
                babyfootId: tableId,
                partyDate: selectedReservation.partyDate,
                refereeId: selectedReservation.referee?.id,
                redDefenseId: selectedReservation.redDefense?.id,
                redAttackId: selectedReservation.redAttack?.id,
                blueDefenseId: selectedReservation.blueDefense?.id,
                blueAttackId: selectedReservation.blueAttack?.id,
              }
            : { babyfootId: tableId }
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
        tables={[table]}
        players={players}
        disableTableSelection={true}
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
