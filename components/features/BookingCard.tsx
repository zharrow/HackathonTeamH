"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Users, Zap } from "lucide-react";
import { toast } from "sonner";

const MATCH_FORMATS = [
  { value: "ONE_VS_ONE", label: "1 vs 1", icon: "👤👤" },
  { value: "ONE_VS_TWO", label: "1 vs 2", icon: "👤👥" },
  { value: "TWO_VS_TWO", label: "2 vs 2", icon: "👥👥" },
];

// Génération des créneaux horaires (15 min)
const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  for (let hour = 8; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      // Skip past time slots for today
      if (hour > currentHour || (hour === currentHour && min > currentMin)) {
        const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
  }
  return slots;
};

interface BookingCardProps {
  babyfootId?: string | null;
  onClose?: () => void;
}

export function BookingCard({ babyfootId, onClose }: BookingCardProps) {
  const [selectedBabyfoot, setSelectedBabyfoot] = useState<string>(babyfootId || "");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [matchFormat, setMatchFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!selectedBabyfoot || !selectedTime || !matchFormat) {
      toast.error("Informations manquantes", {
        description: "Veuillez remplir tous les champs pour continuer",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create reservation date from selected time
      const today = new Date();
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const reservationDate = new Date(today);
      reservationDate.setHours(hours, minutes, 0, 0);

      // Call API to create reservation
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          babyfootId: selectedBabyfoot,
          partyDate: reservationDate.toISOString(),
          format: matchFormat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Erreur", {
          description: data.error || "Impossible de créer la réservation",
        });
        setIsLoading(false);
        return;
      }

      // Success - show appropriate message
      if (data.queuePosition > 0) {
        toast.success("Ajouté à la file d'attente !", {
          description: `Position ${data.queuePosition} dans la file d'attente. Vous serez notifié quand c'est votre tour.`,
          duration: 5000,
        });
      } else {
        toast.success("Réservation confirmée !", {
          description: `Votre partie est confirmée pour ${selectedTime}. Bon match !`,
          duration: 5000,
        });
      }

      // Reset form
      setSelectedBabyfoot(babyfootId || "");
      setSelectedTime("");
      setMatchFormat("");

      // Close dialog after a short delay
      if (onClose) {
        setTimeout(() => {
          onClose();
          // Refresh the page to show updated data
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Erreur réseau", {
        description: "Impossible de contacter le serveur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="w-full bg-[#0f1923] border border-gray-700 rounded p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-magenta-500" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                Réservation
              </h2>
            </div>
            <p className="text-gray-400 text-sm pl-7">
              Choisissez votre table et lancez-vous dans une partie de 15 minutes
            </p>
          </div>

          {/* Format de match - Pills modernes */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3 h-3" />
              Format de match
            </label>
            <div className="flex gap-3">
              {MATCH_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setMatchFormat(format.value)}
                  className={`flex-1 p-4 rounded border-2 transition-all ${
                    matchFormat === format.value
                      ? "border-magenta-400 bg-magenta-400/10"
                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-1">{format.icon}</div>
                  <p className="text-sm font-bold text-white">{format.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de l'heure - Timeline moderne */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Heure de début
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded border transition-all text-center ${
                    selectedTime === time
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 font-bold"
                      : "border-gray-700 bg-gray-800/30 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton de réservation */}
          <Button
            onClick={handleBooking}
            disabled={isLoading || !selectedBabyfoot || !selectedTime || !matchFormat}
            className="w-full bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 bg-[length:200%_100%] hover:bg-right-bottom text-black font-black py-6 text-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 relative overflow-hidden group"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Réservation...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Réserver maintenant
              </span>
            )}
          </Button>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded">
            <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              Créneau de <span className="text-cyan-400 font-bold">15 minutes</span>.
              Prolongez ou terminez depuis votre profil.
            </p>
          </div>
    </div>
  );
}
