"use client";

import { Trophy, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ElectricBorder from "@/components/ElectricBorder";

interface MvpPlayerCardProps {
  player?: {
    nickname: string;
    imageUrl?: string;
  };
}

export function MvpPlayerCard({ player }: MvpPlayerCardProps) {
  // Données mockées si aucun joueur n'est fourni
  const mvpPlayer = player || {
    nickname: "Faker",
    imageUrl: "/faker.png",
  };

  // Initiales pour le fallback
  const initials = mvpPlayer.nickname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ElectricBorder
        color="#00FFF7"
        speed={0.8}
        chaos={0.6}
        thickness={5}
        className="bg-[#0D0D0D]"
        style={{ borderRadius: 2 }}
      >
        <div className="relative overflow-hidden">
          {/* Motif géométrique en arrière-plan style Valorant */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF00FF] to-transparent transform rotate-45 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00FFF7] to-transparent transform -rotate-45 -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex items-center gap-8 p-6">
            {/* Section gauche - Photo */}
            <div className="relative flex-shrink-0">
              {/* Badge MVP en haut à gauche */}
              <div className="absolute -top-3 -left-3 z-10 bg-[#00FFF7] px-3 py-1 clip-path-corner glow-cyan">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-black fill-black" />
                  <span className="text-black font-black text-xs tracking-wider">
                    MVP
                  </span>
                </div>
              </div>

              {/* Cadre photo hexagonal */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FFF7] to-[#FF00FF] opacity-50 blur-xl" />
                <Avatar className="relative w-40 h-40 border-4 border-[#00FFF7] clip-path-hexagon glow-cyan-intense">
                  <AvatarImage
                    src={mvpPlayer.imageUrl}
                    alt={mvpPlayer.nickname}
                    className="object-fit object-cover scale-100"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#00FFF7] to-[#FF00FF] text-black text-5xl font-black clip-path-hexagon">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Section droite - Info */}
            <div className="flex-1 space-y-4">
              {/* Pseudo */}
              <h3 className="font-heading text-5xl text-white leading-none text-glow-cyan">
                {mvpPlayer.nickname}
              </h3>
            </div>

            {/* Icône décorative en arrière-plan */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-5">
              <Trophy className="w-48 h-48 text-[#FF00FF]" />
            </div>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}
