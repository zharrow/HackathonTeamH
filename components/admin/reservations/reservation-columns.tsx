"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";

export interface Reservation {
  id: string;
  partyDate: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "FINISHED"
    | "CANCELLED"
    | "EXPIRED";
  babyfoot: {
    id: string;
    name: string;
  };
  referee?: {
    id: string;
    name: string;
  } | null;
  redDefense?: {
    id: string;
    name: string;
  } | null;
  redAttack?: {
    id: string;
    name: string;
  } | null;
  blueDefense?: {
    id: string;
    name: string;
  } | null;
  blueAttack?: {
    id: string;
    name: string;
  } | null;
}

interface ReservationColumnsConfig {
  t: (key: string) => string;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
}

export function getReservationColumns({
  t,
  onEdit,
  onDelete,
}: ReservationColumnsConfig): ColumnDef<Reservation>[] {
  const statusLabels = {
    PENDING: t("pending"),
    CONFIRMED: t("confirmed"),
    IN_PROGRESS: t("inProgress"),
    FINISHED: t("finished"),
    CANCELLED: t("cancelled"),
    EXPIRED: t("expired"),
  };

  const statusVariants: Record<
    Reservation["status"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "secondary",
    CONFIRMED: "default",
    IN_PROGRESS: "outline",
    FINISHED: "secondary",
    CANCELLED: "destructive",
    EXPIRED: "destructive",
  };

  return [
    {
      accessorKey: "partyDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("partyDate")} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("partyDate"));
        return (
          <div className="flex flex-col">
            <span className="font-medium">{format(date, "dd/MM/yyyy")}</span>
            <span className="text-xs text-muted-foreground">
              {format(date, "HH:mm")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "babyfoot.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("babyfoot")} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.original.babyfoot.name}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={statusVariants[status]} className="font-medium">
            {statusLabels[status]}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "players",
      header: t("players"),
      cell: ({ row }) => {
        const reservation = row.original;
        const players = [
          reservation.referee?.name,
          reservation.redDefense?.name,
          reservation.redAttack?.name,
          reservation.blueDefense?.name,
          reservation.blueAttack?.name,
        ].filter(Boolean);

        return (
          <div className="flex flex-wrap gap-1">
            {players.length > 0 ? (
              players.slice(0, 3).map((player, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {player}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
            {players.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{players.length - 3}
              </Badge>
            )}
          </div>
        );
      },
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
