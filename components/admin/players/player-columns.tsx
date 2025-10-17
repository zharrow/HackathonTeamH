"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { RoleBadge } from "@/lib/utils/player-badges";

export interface Player {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  image?: string | null;
  createdAt: string;
  _count?: {
    reservationsAsRedDefense: number;
    reservationsAsRedAttack: number;
    reservationsAsBlueDefense: number;
    reservationsAsBlueAttack: number;
  };
}

interface PlayerColumnsConfig {
  t: (key: string) => string;
  onChangeRole: (player: Player) => void;
  onDelete: (player: Player) => void;
}

export function getPlayerColumns({
  t,
  onChangeRole,
  onDelete,
}: PlayerColumnsConfig): ColumnDef<Player>[] {
  const roleLabels = {
    USER: t("user"),
    ADMIN: t("admin"),
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.image || undefined}
              alt={row.original.name}
            />
            <AvatarFallback>
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {row.original.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("role")} />
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        return <RoleBadge role={role} label={roleLabels[role]} />;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "elo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("elo")} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono font-semibold">
          {row.getValue("elo")}
        </Badge>
      ),
    },
    {
      id: "stats",
      header: t("stats"),
      cell: ({ row }) => {
        const player = row.original;
        const totalGames = player.wins + player.losses + player.draws;
        const winRate =
          totalGames > 0 ? Math.round((player.wins / totalGames) * 100) : 0;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600 font-medium">{player.wins}W</span>
              <span className="text-red-600 font-medium">{player.losses}L</span>
              <span className="text-muted-foreground font-medium">
                {player.draws}D
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {winRate}% {t("winRate")}
            </span>
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
                    onChangeRole(row.original);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("changeRole")}</p>
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
                <p>{t("deletePlayer")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ];
}
