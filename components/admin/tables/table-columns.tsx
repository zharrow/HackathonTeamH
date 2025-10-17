"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { StatusBadge, ConditionBadge } from "@/lib/utils/table-badges";

export interface BabyfootTable {
  id: string;
  name: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  location?: string;
  condition?: "EXCELLENT" | "BON" | "MOYEN";
  _count: {
    reservations: number;
    queue: number;
  };
}

interface TableColumnsConfig {
  t: (key: string) => string;
  onEdit: (table: BabyfootTable) => void;
  onDelete: (table: BabyfootTable) => void;
}

export function getTableColumns({
  t,
  onEdit,
  onDelete,
}: TableColumnsConfig): ColumnDef<BabyfootTable>[] {
  const statusLabels = {
    AVAILABLE: t("available"),
    OCCUPIED: t("occupied"),
    MAINTENANCE: t("maintenance"),
  };

  const conditionLabels = {
    EXCELLENT: t("excellent"),
    BON: t("good"),
    MOYEN: t("average"),
    MAINTENANCE: t("maintenance"),
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return <StatusBadge status={status} label={statusLabels[status]} />;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "condition",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("condition")} />
      ),
      cell: ({ row }) => {
        const condition = row.original.condition;
        return (
          <ConditionBadge condition={condition} labels={conditionLabels} />
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("location")} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("location") || "-"}
        </span>
      ),
    },
    {
      id: "reservations",
      accessorFn: (row) => row._count.reservations,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("reservations")} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original._count.reservations}
        </Badge>
      ),
    },
    {
      id: "queue",
      accessorFn: (row) => row._count.queue,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("queue")} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original._count.queue}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row.original);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("edit")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row.original);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("delete")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ];
}
