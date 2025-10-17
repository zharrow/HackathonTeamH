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
import { HoverGlow } from "@/components/animations";

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
          <HoverGlow key={babyfoot.id} glowColor="magenta" intensity="high" className="relative bg-[#0D0D0D] border-2 min-h-100 border-[#00FFF7]/20 rounded-lg overflow-hidden group hover:border-[#00FFF7] transition-colors duration-300">

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
                  <span className="px-3 py-1 bg-[#FF4B4B] backdrop-blur-sm text-white text-xs font-black rounded uppercase flex items-center gap-1 glow-cyan">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Occupé
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#00FF6C] backdrop-blur-sm text-black text-xs font-black rounded uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    Libre
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <h3 className="font-subheading text-xl text-[#F2F2F2] uppercase tracking-tight">
                  {babyfoot.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-[#B0B0B0]" />
                  <p className="font-body text-sm text-[#B0B0B0]">{babyfoot.location}</p>
                </div>
              </div>

              {/* Availability info */}
              {babyfoot.status === "occupied" && babyfoot.availableAt && (
                <div className="flex items-center gap-2 p-2 bg-[#FF00FF]/10 border border-[#FF00FF]/20 rounded">
                  <Clock className="w-4 h-4 text-[#FF00FF] flex-shrink-0" />
                  <p className="font-body text-xs text-[#FF00FF]">
                    Disponible à <span className="font-bold">{babyfoot.availableAt}</span>
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => handleBooking(babyfoot.id)}
                className="w-full bg-gradient-to-r from-[#00FFF7] to-[#FF00FF] hover:from-[#00FFF7]/80 hover:to-[#FF00FF]/80 text-black font-black uppercase text-sm py-5 transition-colors"
              >
                <Zap className="w-4 h-4 mr-2" />
                Réserver
              </Button>
            </div>

          </HoverGlow>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl bg-[#0D0D0D] border-[#00FFF7]/30 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-[#F2F2F2]">
              Réserver un Babyfoot
            </DialogTitle>
            <DialogDescription className="font-body text-[#B0B0B0]">
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
