"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdvancedDataTable } from "@/components/admin/advanced-data-table";
import { TableFormDialog } from "@/components/admin/table-form-dialog";
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog";
import {
  TableStats,
  TableFilters,
  TableEmptyState,
  getTableColumns,
  type BabyfootTable,
} from "@/components/admin/tables";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useTableStats } from "@/hooks/use-table-stats";

interface TableFormData {
  name: string;
  location?: string;
  condition?: string;
  status?: string;
}

export default function TablesPage() {
  const t = useTranslations("table");
  const [tables, setTables] = useState<BabyfootTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTable, setSelectedTable] = useState<BabyfootTable | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom hooks for filtering and stats
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredTables,
  } = useTableFilters(tables);

  const stats = useTableStats(tables);

  // Fetch tables from API
  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/tables");
      const data = await response.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error(t("tableDeletionError"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTables();
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setIsFormOpen(true);
  };

  const handleEdit = (table: BabyfootTable) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (table: BabyfootTable) => {
    setSelectedTable(table);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: TableFormData) => {
    try {
      const url = selectedTable
        ? `/api/admin/tables/${selectedTable.id}`
        : "/api/admin/tables";

      const method = selectedTable ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(selectedTable ? t("tableUpdated") : t("tableCreated"));
        await fetchTables();
        setIsFormOpen(false);
      } else {
        toast.error(
          selectedTable ? t("tableUpdateError") : t("tableCreationError")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        selectedTable ? t("tableUpdateError") : t("tableCreationError")
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedTable) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tables/${selectedTable.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t("tableDeleted"));
        await fetchTables();
        setIsDeleteOpen(false);
      } else {
        toast.error(t("tableDeletionError"));
      }
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error(t("tableDeletionError"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Define table columns
  const columns = getTableColumns({
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
            {t("addTable")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!isLoading && <TableStats stats={stats} />}

      {/* Filters and Search */}
      {!isLoading && tables.length > 0 && (
        <TableFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      )}

      {/* Data Table or Empty State */}
      {!isLoading && tables.length === 0 ? (
        <TableEmptyState onCreate={handleCreate} />
      ) : (
        <AdvancedDataTable
          columns={columns}
          data={filteredTables}
          isLoading={isLoading}
        />
      )}

      {/* Create/Edit Dialog */}
      <TableFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={
          selectedTable
            ? {
                name: selectedTable.name,
                location: selectedTable.location,
                condition: selectedTable.condition,
                status: selectedTable.status,
              }
            : undefined
        }
        title={selectedTable ? t("editTableTitle") : t("addTableTitle")}
        description={
          selectedTable ? t("editTableDescription") : t("addTableDescription")
        }
      />

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title={t("deleteTableTitle")}
        description={t("deleteTableDescription")}
        isLoading={isDeleting}
      />
    </div>
  );
}
