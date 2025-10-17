"use server";

import { prisma } from "@/lib/prisma";

export async function getTopPlayers(limit: number = 3) {
  try {
    const players = await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: [
        {
          elo: "desc",
        },
        {
          wins: "desc",
        },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        elo: true,
        wins: true,
        losses: true,
      },
    });

    return players.map((player, index) => ({
      rank: index + 1,
      nickname: player.name,
      imageUrl: player.image || undefined,
      elo: player.elo,
      wins: player.wins,
      losses: player.losses,
    }));
  } catch (error) {
    console.error("Error fetching top players:", error);
    return [];
  }
}
