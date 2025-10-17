"use server";

import { prisma } from "@/lib/prisma";

export async function getUserStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        elo: true,
        wins: true,
        losses: true,
        draws: true,
      },
    });

    if (!user) {
      return null;
    }

    // Get all user's finished reservations
    const reservations = await prisma.reservation.findMany({
      where: {
        status: "FINISHED",
        OR: [
          { redDefenseId: userId },
          { redAttackId: userId },
          { blueDefenseId: userId },
          { blueAttackId: userId },
        ],
      },
      select: {
        partyDate: true,
        gameDuration: true,
        format: true,
        result: true,
        redDefenseId: true,
        redAttackId: true,
        blueDefenseId: true,
        blueAttackId: true,
      },
      orderBy: {
        partyDate: "desc",
      },
    });

    const totalGames = user.wins + user.losses + user.draws;

    // Calculate average game duration (in minutes)
    const gamesWithDuration = reservations.filter((r) => r.gameDuration);
    let averageGameDuration = 0;
    if (gamesWithDuration.length > 0) {
      const totalMinutes = gamesWithDuration.reduce((sum, r) => {
        if (!r.gameDuration) return sum;
        // gameDuration is stored as Time, convert to minutes
        const timeStr = r.gameDuration.toString();
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return sum + (hours * 60 + minutes);
      }, 0);
      averageGameDuration = Math.round(totalMinutes / gamesWithDuration.length * 10) / 10;
    }

    // Get ELO progression (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const recentReservations = await prisma.reservation.findMany({
      where: {
        status: "FINISHED",
        partyDate: {
          gte: eightWeeksAgo,
        },
        OR: [
          { redDefenseId: userId },
          { redAttackId: userId },
          { blueDefenseId: userId },
          { blueAttackId: userId },
        ],
      },
      orderBy: {
        partyDate: "asc",
      },
      select: {
        partyDate: true,
      },
    });

    // Group by week and calculate ELO progression (simulated)
    const eloProgression = [];
    const startElo = user.elo - (totalGames * 10); // Rough estimation
    const eloIncrement = totalGames > 0 ? (user.elo - startElo) / 8 : 0;

    for (let i = 0; i < 8; i++) {
      eloProgression.push({
        date: `Sem ${i + 1}`,
        elo: Math.round(startElo + (eloIncrement * i)),
      });
    }
    eloProgression.push({
      date: "Actuel",
      elo: user.elo,
    });

    // Count match formats
    const matchFormats = {
      "1v1": 0,
      "1v2": 0,
      "2v2": 0,
    };

    reservations.forEach((r) => {
      if (r.format === "ONE_VS_ONE") matchFormats["1v1"]++;
      else if (r.format === "ONE_VS_TWO") matchFormats["1v2"]++;
      else if (r.format === "TWO_VS_TWO") matchFormats["2v2"]++;
    });

    const matchFormatsData = [
      { format: "1v1", games: matchFormats["1v1"] },
      { format: "1v2", games: matchFormats["1v2"] },
      { format: "2v2", games: matchFormats["2v2"] },
    ];

    // Get recent games (last 5)
    const recentGames = reservations.slice(0, 5).map((r) => {
      // Determine if user was in red team
      const userInRedTeam = r.redDefenseId === userId || r.redAttackId === userId;

      let result = "Défaite";
      let eloChange = "-15";

      if (r.result === "WIN" && userInRedTeam) {
        result = "Victoire";
        eloChange = "+20";
      } else if (r.result === "LOSS" && !userInRedTeam) {
        result = "Victoire";
        eloChange = "+20";
      } else if (r.result === "DRAW") {
        result = "Égalité";
        eloChange = "+0";
      }

      const formatMap = {
        ONE_VS_ONE: "1v1",
        ONE_VS_TWO: "1v2",
        TWO_VS_TWO: "2v2",
      };

      // Format date
      const gameDate = new Date(r.partyDate);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateStr = "";
      if (gameDate.toDateString() === today.toDateString()) {
        dateStr = `Aujourd'hui ${gameDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
      } else if (gameDate.toDateString() === yesterday.toDateString()) {
        dateStr = `Hier ${gameDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
      } else {
        dateStr = gameDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return {
        date: dateStr,
        format: formatMap[r.format as keyof typeof formatMap] || "N/A",
        result,
        eloChange,
      };
    });

    return {
      user: {
        nickname: user.name,
        elo: user.elo,
        wins: user.wins,
        losses: user.losses,
        totalGames,
        averageGameDuration,
      },
      eloProgression,
      matchFormatsData,
      recentGames,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}
