"use client";

import { Trophy, Medal, Award, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ElectricBorder from "@/components/ElectricBorder";
import { HoverGlow } from "@/components/animations";

interface Player {
  rank: number;
  nickname: string;
  imageUrl?: string;
  elo: number;
  wins: number;
  losses: number;
}

interface LeaderboardPodiumProps {
  players?: Player[];
}

// Données mockées par défaut
const DEFAULT_PLAYERS: Player[] = [
  { rank: 1, nickname: "Faker", imageUrl: "/faker.png", elo: 1456, wins: 42, losses: 12 },
  { rank: 2, nickname: "TheShy", imageUrl: "/faker.png", elo: 1398, wins: 38, losses: 15 },
  { rank: 3, nickname: "Rookie", imageUrl: "/faker.png", elo: 1342, wins: 35, losses: 18 },
];

export function LeaderboardPodium({ players = DEFAULT_PLAYERS }: LeaderboardPodiumProps) {
  const [first, second, third] = players;

  const getInitials = (nickname: string) => {
    return nickname
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-[#00FFF7]";
      case 2: return "bg-[#B0B0B0]";
      case 3: return "bg-[#FF00FF]/50";
      default: return "bg-[#0D0D0D]";
    }
  };

  const getRankBorder = (rank: number) => {
    switch (rank) {
      case 1: return "border-[#00FFF7]";
      case 2: return "border-[#B0B0B0]";
      case 3: return "border-[#FF00FF]";
      default: return "border-[#00FFF7]/20";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-black" />;
      case 2: return <Medal className="w-5 h-5 text-black" />;
      case 3: return <Award className="w-5 h-5 text-black" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto" role="region" aria-label="Podium des meilleurs joueurs">
      {/* Disposition du podium : 2ème - 1er - 3ème */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-center">
        {/* 2ème place */}
        {second && (
          <div className="md:w-64 w-full md:mb-8">
            <HoverGlow glowColor="cyan" intensity="low">
              <PlayerCard player={second} getInitials={getInitials} getRankColor={getRankColor} getRankIcon={getRankIcon} getRankBorder={getRankBorder} />
            </HoverGlow>
          </div>
        )}

        {/* 1ère place (MVP - Plus grande avec ElectricBorder) */}
        {first && (
          <div className="md:w-96 w-full md:z-10">
            <ElectricBorder color="#00FFF7" speed={0.8} chaos={0.6} thickness={5} className="bg-[#0D0D0D]" style={{ borderRadius: 2 }}>
              <div className="p-6 relative">
                {/* Badge MVP */}
                <div className="absolute -top-3 -left-3 z-10 bg-[#00FFF7] px-3 py-1 clip-path-corner glow-cyan">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-black fill-black" />
                    <span className="text-black font-black text-xs tracking-wider">MVP</span>
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center mt-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FFF7] to-[#FF00FF] opacity-50 blur-xl" />
                    <Avatar className="relative w-32 h-32 border-4 border-[#00FFF7] clip-path-hexagon glow-cyan-intense">
                      <AvatarImage src={first.imageUrl} alt={first.nickname} className="object-cover scale-110" />
                      <AvatarFallback className="bg-gradient-to-br from-[#00FFF7] to-[#FF00FF] text-black text-4xl font-black clip-path-hexagon">
                        {getInitials(first.nickname)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-heading text-3xl text-white text-center leading-none text-glow-cyan mb-4">
                  {first.nickname}
                </h3>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#00FFF7]/10 border-l-4 border-[#00FFF7]">
                    <span className="font-body text-xs text-[#B0B0B0] uppercase font-bold">ELO</span>
                    <span className="font-heading text-2xl text-[#00FFF7]">{first.elo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-center p-2 bg-[#00FF6C]/10 border border-[#00FF6C]/30">
                      <span className="text-[#00FF6C] font-black text-sm">{first.wins} V</span>
                    </div>
                    <div className="flex items-center justify-center p-2 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30">
                      <span className="text-[#FF4B4B] font-black text-sm">{first.losses} D</span>
                    </div>
                  </div>
                </div>
              </div>
            </ElectricBorder>
          </div>
        )}

        {/* 3ème place */}
        {third && (
          <div className="md:w-64 w-full md:mb-8">
            <HoverGlow glowColor="magenta" intensity="low">
              <PlayerCard player={third} getInitials={getInitials} getRankColor={getRankColor} getRankIcon={getRankIcon} getRankBorder={getRankBorder} />
            </HoverGlow>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour 2ème et 3ème place
function PlayerCard({
  player,
  getInitials,
  getRankColor,
  getRankIcon,
  getRankBorder,
}: {
  player: Player;
  getInitials: (nickname: string) => string;
  getRankColor: (rank: number) => string;
  getRankIcon: (rank: number) => JSX.Element | null;
  getRankBorder: (rank: number) => string;
}) {
  return (
    <div className="bg-[#0D0D0D] border-2 border-[#00FFF7]/20 p-4 relative clip-path-corner">
      {/* Badge rang */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div className={`px-3 py-1 ${getRankColor(player.rank)} flex items-center gap-1.5 shadow-lg clip-path-corner`}>
          {getRankIcon(player.rank)}
          <span className="text-xs font-black text-black">#{player.rank}</span>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mt-3 mb-3">
        <Avatar className={`w-20 h-20 border-3 ${getRankBorder(player.rank)}`}>
          <AvatarImage src={player.imageUrl} alt={player.nickname} className="object-cover scale-110" />
          <AvatarFallback className={`${getRankColor(player.rank)} text-black text-2xl font-black`}>
            {getInitials(player.nickname)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info */}
      <h4 className="font-subheading text-lg text-[#F2F2F2] text-center uppercase tracking-tight mb-2">
        {player.nickname}
      </h4>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-[#00FFF7]/10 border-l-2 border-[#00FFF7]">
          <span className="font-body text-xs text-[#B0B0B0] uppercase font-bold">ELO</span>
          <span className="font-subheading text-lg text-[#00FFF7]">{player.elo}</span>
        </div>
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex-1 text-center p-1 bg-[#00FF6C]/10 border border-[#00FF6C]/30">
            <span className="text-[#00FF6C] font-black">{player.wins}V</span>
          </div>
          <div className="flex-1 text-center p-1 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30">
            <span className="text-[#FF4B4B] font-black">{player.losses}D</span>
          </div>
        </div>
      </div>
    </div>
  );
}
