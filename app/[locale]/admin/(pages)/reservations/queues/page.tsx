"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { ArrowLeft, RefreshCw, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface QueuedReservation {
  id: string;
  queuePosition: number;
  createdAt: string;
  redDefense?: { name: string };
  redAttack?: { name: string };
  blueDefense?: { name: string };
  blueAttack?: { name: string };
}

interface QueueSlot {
  time: string;
  queueLength: number;
  reservations: QueuedReservation[];
}

interface QueueData {
  babyfootId: string;
  babyfootName: string;
  slots: QueueSlot[];
}

export default function QueuesMonitoringPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const [queues, setQueues] = useState<QueueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalPending, setTotalPending] = useState(0);

  const fetchQueues = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/reservations/queues");
      const data = await response.json();
      if (data.success) {
        setQueues(data.data);
        setTotalPending(data.totalPending);
      }
    } catch (error) {
      console.error("Error fetching queues:", error);
      toast.error("Error loading queues");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueues();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading queues...</p>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              {t("queueManagement")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("queueManagementDescription")}
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
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Total en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {totalPending}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalPending === 1 ? "réservation" : "réservations"} dans les
              files d&apos;attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queues by Table */}
      {queues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold mb-2">
              Aucune file d&apos;attente
            </h3>
            <p className="text-sm text-muted-foreground">
              Tous les créneaux sont disponibles ou confirmés
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {queues.map((queue) => (
            <Card key={queue.babyfootId} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {queue.babyfootName}
                    </CardTitle>
                    <CardDescription>
                      {queue.slots.reduce(
                        (acc, slot) => acc + slot.queueLength,
                        0
                      )}{" "}
                      {queue.slots.reduce(
                        (acc, slot) => acc + slot.queueLength,
                        0
                      ) === 1
                        ? "réservation"
                        : "réservations"}{" "}
                      en attente
                    </CardDescription>
                  </div>
                  <Link
                    href={`/${locale}/admin/reservations/${queue.babyfootId}`}
                  >
                    <Button size="sm" variant="outline">
                      Voir la table
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {queue.slots.map((slot) => (
                    <div
                      key={slot.time}
                      className="border rounded-lg p-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {format(parseISO(slot.time), "PPp")}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {slot.queueLength} en attente
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {slot.reservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-3 bg-background rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                {reservation.queuePosition}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {[
                                    reservation.redDefense?.name,
                                    reservation.redAttack?.name,
                                    reservation.blueDefense?.name,
                                    reservation.blueAttack?.name,
                                  ]
                                    .filter(Boolean)
                                    .map((name, idx) => (
                                      <Badge key={idx} variant="outline">
                                        {name}
                                      </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Ajouté le{" "}
                                  {format(
                                    parseISO(reservation.createdAt),
                                    "PPp"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
