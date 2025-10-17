"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, XCircle, Play, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  id: string;
  partyDate: string;
  status: string;
  format: string;
  babyfoot: {
    name: string;
    location: string;
  };
}

interface QueueEntry {
  id: string;
  babyfootId: string;
  queuePosition: number;
  estimatedWaitTime: number;
  reservationTime: string;
  babyfoot: {
    name: string;
    location: string;
    status: string;
  };
}

export function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [resResponse, queueResponse] = await Promise.all([
        fetch("/api/reservations"),
        fetch("/api/queue"),
      ]);

      if (resResponse.ok) {
        const resData = await resResponse.json();
        // Filter to show only active reservations (not finished or cancelled)
        const activeReservations = resData.data.filter(
          (r: Reservation) => !["FINISHED", "CANCELLED"].includes(r.status)
        );
        setReservations(activeReservations);
      }

      if (queueResponse.ok) {
        const queueData = await queueResponse.json();
        setQueueEntries(queueData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }

    setActionLoading(reservationId);
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Réservation annulée");
        fetchData();
      } else {
        const data = await response.json();
        toast.error("Erreur", { description: data.error });
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartGame = async (reservationId: string) => {
    setActionLoading(reservationId);
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      if (response.ok) {
        toast.success("Partie démarrée !");
        fetchData();
      } else {
        const data = await response.json();
        toast.error("Erreur", { description: data.error });
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinishGame = async (reservationId: string) => {
    setActionLoading(reservationId);
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish" }),
      });

      if (response.ok) {
        toast.success("Partie terminée !");
        fetchData();
      } else {
        const data = await response.json();
        toast.error("Erreur", { description: data.error });
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      CONFIRMED: { label: "Confirmé", className: "bg-[#00FF6C] text-black" },
      IN_PROGRESS: { label: "En cours", className: "bg-[#00FFF7] text-black" },
      PENDING: { label: "En attente", className: "bg-[#FF00FF]/20 text-[#FF00FF]" },
    };

    const config = statusMap[status] || { label: status, className: "bg-[#B0B0B0]" };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMatchType = (format: string) => {
    const formatMap: Record<string, string> = {
      ONE_VS_ONE: "1 vs 1",
      ONE_VS_TWO: "1 vs 2",
      TWO_VS_TWO: "2 vs 2",
    };
    return formatMap[format] || format;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00FFF7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Reservations */}
      <Card className="bg-[#0D0D0D] border-[#00FFF7]/20">
        <CardHeader>
          <CardTitle className="font-subheading text-[#00FFF7]">
            Mes Réservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-[#B0B0B0] text-center py-8">
              Aucune réservation active
            </p>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-[#0D0D0D]/50 border border-[#00FFF7]/10 p-4 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-subheading text-[#F2F2F2]">
                          {reservation.babyfoot.name}
                        </h3>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#B0B0B0]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {reservation.babyfoot.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(reservation.partyDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {formatMatchType(reservation.format)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {reservation.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartGame(reservation.id)}
                          disabled={actionLoading === reservation.id}
                          className="bg-[#00FFF7] hover:bg-[#00FFF7]/80 text-black"
                        >
                          {actionLoading === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Démarrer
                            </>
                          )}
                        </Button>
                      )}
                      {reservation.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          onClick={() => handleFinishGame(reservation.id)}
                          disabled={actionLoading === reservation.id}
                          className="bg-[#00FF6C] hover:bg-[#00FF6C]/80 text-black"
                        >
                          {actionLoading === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Terminer
                            </>
                          )}
                        </Button>
                      )}
                      {reservation.status !== "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={actionLoading === reservation.id}
                        >
                          {actionLoading === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Annuler
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Status */}
      {queueEntries.length > 0 && (
        <Card className="bg-[#0D0D0D] border-[#FF00FF]/20">
          <CardHeader>
            <CardTitle className="font-subheading text-[#FF00FF]">
              File d'attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queueEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#FF00FF]/5 border border-[#FF00FF]/20 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-subheading text-[#F2F2F2]">
                        {entry.babyfoot.name}
                      </h3>
                      <p className="text-sm text-[#B0B0B0] mt-1">
                        Position: <span className="text-[#FF00FF] font-bold">#{entry.queuePosition}</span>
                        {" "} • Temps estimé: {entry.estimatedWaitTime} min
                      </p>
                      <p className="text-xs text-[#B0B0B0] mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDate(entry.reservationTime)}
                      </p>
                    </div>
                    <Badge className="bg-[#FF00FF]/20 text-[#FF00FF]">
                      En attente
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
