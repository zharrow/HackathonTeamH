"use client";

import { useState } from "react";
import { MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingCard } from "./BookingCard";

const BABYFOOTS = [
  {
    id: "1",
    name: "Babyfoot A",
    location: "Salle commune - RDC",
    status: "available",
    availableAt: null,
    image: "/baby1.png", // Image par défaut
  },
  {
    id: "2",
    name: "Babyfoot B",
    location: "Cafétéria - 1er étage",
    status: "occupied",
    availableAt: "14:30",
    image: "/baby2.png",
  },
  {
    id: "3",
    name: "Babyfoot C",
    location: "Espace détente - 2ème étage",
    status: "available",
    availableAt: null,
    image: "/baby1.png",
  },
];

export function BabyfootCards() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBabyfoot, setSelectedBabyfoot] = useState<string | null>(null);

  const handleBooking = (babyfootId: string) => {
    setSelectedBabyfoot(babyfootId);
    setIsBookingOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BABYFOOTS.map((babyfoot) => (
          <div
            key={babyfoot.id}
            className="relative bg-[#0f1923] border-2 border-gray-700 rounded-lg overflow-hidden group hover:border-cyan-400 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-800 overflow-hidden">
              <img
                src={babyfoot.image}
                alt={babyfoot.name}
                className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-300"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] to-transparent" />

              {/* Status badge */}
              <div className="absolute top-3 right-3">
                {babyfoot.status === "occupied" ? (
                  <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-black rounded uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Occupé
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-black rounded uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Libre
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {babyfoot.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">{babyfoot.location}</p>
                </div>
              </div>

              {/* Availability info */}
              {babyfoot.status === "occupied" && babyfoot.availableAt && (
                <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <p className="text-xs text-yellow-400">
                    Disponible à <span className="font-bold">{babyfoot.availableAt}</span>
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => handleBooking(babyfoot.id)}
                className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-black font-black uppercase text-sm py-5 transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                Réserver
              </Button>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-cyan-400/20 border-r-[30px] border-r-transparent group-hover:border-t-cyan-400 transition-all" />
          </div>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl bg-gray-950 border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white uppercase">
              Réserver un Babyfoot
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedBabyfoot && (() => {
                const babyfoot = BABYFOOTS.find(b => b.id === selectedBabyfoot);
                return babyfoot ? `${babyfoot.name} - ${babyfoot.location}` : '';
              })()}
            </DialogDescription>
          </DialogHeader>
          <BookingCard
            babyfootId={selectedBabyfoot}
            onClose={() => setIsBookingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
