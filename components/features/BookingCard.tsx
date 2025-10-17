"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Users, Zap } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Team selection - which team the current user wants to join
  const [selectedTeam, setSelectedTeam] = useState<"RED" | "BLUE">("RED");

  // Player selection states
  const [redDefense, setRedDefense] = useState<string>("");
  const [redAttack, setRedAttack] = useState<string>("");
  const [blueDefense, setBlueDefense] = useState<string>("");
  const [blueAttack, setBlueAttack] = useState<string>("");

  // Fetch users for player selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBooking = async () => {
    if (!selectedBabyfoot || !selectedTime || !matchFormat) {
      toast.error("Informations manquantes", {
        description: "Veuillez remplir tous les champs pour continuer",
      });
      return;
    }

    // Validate player selection based on format and selected team
    if (matchFormat === "ONE_VS_ONE") {
      const opponentSelected = selectedTeam === "RED" ? blueDefense : redDefense;
      if (!opponentSelected) {
        toast.error("Joueur manquant", {
          description: "Veuillez sélectionner l'adversaire",
        });
        return;
      }
    }

    if (matchFormat === "ONE_VS_TWO") {
      if (selectedTeam === "RED") {
        // User is alone in red, needs 2 opponents in blue
        if (!blueDefense || !blueAttack) {
          toast.error("Joueurs manquants", {
            description: "Veuillez sélectionner les deux adversaires",
          });
          return;
        }
      } else {
        // User is in blue defense, needs 1 teammate in blue and 1 opponent in red
        if (!blueAttack || !redDefense) {
          toast.error("Joueurs manquants", {
            description: "Veuillez sélectionner votre coéquipier et l'adversaire",
          });
          return;
        }
      }
    }

    if (matchFormat === "TWO_VS_TWO") {
      if (selectedTeam === "RED") {
        // User in red defense, needs red attack and both blue players
        if (!redAttack || !blueDefense || !blueAttack) {
          toast.error("Joueurs manquants", {
            description: "Veuillez sélectionner tous les joueurs",
          });
          return;
        }
      } else {
        // User in blue defense, needs blue attack and both red players
        if (!blueAttack || !redDefense || !redAttack) {
          toast.error("Joueurs manquants", {
            description: "Veuillez sélectionner tous les joueurs",
          });
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      // Create reservation date from selected time
      const today = new Date();
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const reservationDate = new Date(today);
      reservationDate.setHours(hours, minutes, 0, 0);

      // Prepare player IDs based on format and selected team
      const reservationData: any = {
        babyfootId: selectedBabyfoot,
        partyDate: reservationDate.toISOString(),
        format: matchFormat,
        userTeam: selectedTeam, // Tell API which team the user chose
      };

      // Add players based on format
      if (matchFormat === "ONE_VS_ONE") {
        if (selectedTeam === "RED") {
          // User is red defense, opponent is blue defense
          reservationData.blueDefenseId = blueDefense;
        } else {
          // User is blue defense, opponent is red defense
          reservationData.redDefenseId = redDefense;
        }
      } else if (matchFormat === "ONE_VS_TWO") {
        if (selectedTeam === "RED") {
          // User alone in red defense vs 2 in blue
          reservationData.blueDefenseId = blueDefense;
          reservationData.blueAttackId = blueAttack;
        } else {
          // User in blue defense with teammate vs 1 in red
          reservationData.redDefenseId = redDefense;
          reservationData.blueAttackId = blueAttack;
        }
      } else if (matchFormat === "TWO_VS_TWO") {
        if (selectedTeam === "RED") {
          // User in red defense
          reservationData.redAttackId = redAttack;
          reservationData.blueDefenseId = blueDefense;
          reservationData.blueAttackId = blueAttack;
        } else {
          // User in blue defense
          reservationData.redDefenseId = redDefense;
          reservationData.redAttackId = redAttack;
          reservationData.blueAttackId = blueAttack;
        }
      }

      // Call API to create reservation
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
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
      setSelectedTeam("RED");
      setRedDefense("");
      setRedAttack("");
      setBlueDefense("");
      setBlueAttack("");

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

          {/* Team Selection */}
          {matchFormat && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3 h-3" />
                Choisir votre équipe
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTeam("RED")}
                  className={`flex-1 p-4 rounded border-2 transition-all ${
                    selectedTeam === "RED"
                      ? "border-red-400 bg-red-400/10"
                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-1">🔴</div>
                  <p className="text-sm font-bold text-white">Équipe Rouge</p>
                </button>
                <button
                  onClick={() => setSelectedTeam("BLUE")}
                  className={`flex-1 p-4 rounded border-2 transition-all ${
                    selectedTeam === "BLUE"
                      ? "border-blue-400 bg-blue-400/10"
                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-1">🔵</div>
                  <p className="text-sm font-bold text-white">Équipe Bleue</p>
                </button>
              </div>
            </div>
          )}

          {/* Player Selection */}
          {matchFormat && !loadingUsers && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3 h-3" />
                Sélection des joueurs
              </label>

              <div className="space-y-3">
                {/* Team Red */}
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="text-xs font-bold text-red-400 mb-2">ÉQUIPE ROUGE</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300 flex-shrink-0">Défense:</span>
                      {selectedTeam === "RED" ? (
                        <span className="text-sm font-bold text-white">Vous</span>
                      ) : (
                        <select
                          value={redDefense}
                          onChange={(e) => setRedDefense(e.target.value)}
                          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-red-400"
                        >
                          <option value="">Sélectionner un joueur</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {matchFormat === "TWO_VS_TWO" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 flex-shrink-0">Attaque:</span>
                        <select
                          value={redAttack}
                          onChange={(e) => setRedAttack(e.target.value)}
                          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-red-400"
                        >
                          <option value="">Sélectionner un coéquipier</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Blue */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-xs font-bold text-blue-400 mb-2">ÉQUIPE BLEUE</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300 flex-shrink-0">Défense:</span>
                      {selectedTeam === "BLUE" ? (
                        <span className="text-sm font-bold text-white">Vous</span>
                      ) : (
                        <select
                          value={blueDefense}
                          onChange={(e) => setBlueDefense(e.target.value)}
                          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="">Sélectionner un joueur</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {(matchFormat === "ONE_VS_TWO" || matchFormat === "TWO_VS_TWO") && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 flex-shrink-0">Attaque:</span>
                        <select
                          value={blueAttack}
                          onChange={(e) => setBlueAttack(e.target.value)}
                          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="">Sélectionner un adversaire</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
