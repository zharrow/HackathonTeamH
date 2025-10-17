"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface BabyfootCardProps {
  table: {
    id: string;
    name: string;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    location?: string;
  };
  reservationCount: number;
}

export function BabyfootCard({ table, reservationCount }: BabyfootCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const statusConfig = {
    AVAILABLE: {
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10 border-green-500/20",
      label: "Available",
    },
    OCCUPIED: {
      icon: XCircle,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
      label: "Occupied",
    },
    MAINTENANCE: {
      icon: Wrench,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      label: "Maintenance",
    },
  };

  const config = statusConfig[table.status];
  const Icon = config.icon;

  return (
    <Link href={`/${locale}/admin/reservations/${table.id}`}>
      <Card
        className={cn(
          "group cursor-pointer transition-all hover:scale-[1.03] border-2 relative overflow-hidden",
          "border-border hover:border-primary/50 hover:shadow-lg"
        )}
      >
        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
            "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          )}
        />

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {table.name}
              </h3>
              {table.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-primary" />
                  {table.location}
                </p>
              )}
            </div>
            <div
              className={cn(
                "p-2.5 rounded-full transition-all group-hover:scale-110",
                config.bg
              )}
            >
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className="font-mono font-semibold border-primary/30 bg-primary/5"
            >
              {reservationCount} réservation{reservationCount !== 1 ? "s" : ""}
            </Badge>
            <Badge
              variant={table.status === "AVAILABLE" ? "default" : "secondary"}
              className={cn("font-medium shadow-sm", config.color)}
            >
              {config.label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
