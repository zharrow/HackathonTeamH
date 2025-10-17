"use server";

import { prisma } from "@/lib/prisma";
import { BabyfootStatus } from "@prisma/client";

export async function getBabyfoots() {
  try {
    const now = new Date();

    const babyfoots = await prisma.babyfoot.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        reservations: {
          where: {
            status: {
              in: ["CONFIRMED", "IN_PROGRESS"],
            },
          },
          orderBy: {
            partyDate: "asc",
          },
        },
        queue: {
          where: {
            expiredAt: null,
          },
        },
      },
    });

    return babyfoots.map((babyfoot) => {
      // Find current active reservation (IN_PROGRESS only)
      const activeReservation = babyfoot.reservations.find(
        (r) => r.status === "IN_PROGRESS"
      );

      // Find next confirmed reservation
      const nextReservation = babyfoot.reservations.find(
        (r) => r.status === "CONFIRMED" && new Date(r.partyDate) >= now
      );

      // Determine actual status
      // Only OCCUPIED if there's an IN_PROGRESS reservation
      let actualStatus: "available" | "occupied" | "maintenance" = "available";

      if (babyfoot.status === "MAINTENANCE") {
        actualStatus = "maintenance";
      } else if (activeReservation) {
        actualStatus = "occupied";
      }

      // Calculate available time
      let availableAt = null;
      if (activeReservation) {
        const reservationEnd = new Date(activeReservation.partyDate);
        // Assume 15 minutes per reservation
        reservationEnd.setMinutes(reservationEnd.getMinutes() + 15);

        // Format time as HH:MM
        const hours = reservationEnd.getHours().toString().padStart(2, "0");
        const minutes = reservationEnd.getMinutes().toString().padStart(2, "0");
        availableAt = `${hours}:${minutes}`;
      } else if (nextReservation) {
        // Show next reservation time if not started yet
        const nextTime = new Date(nextReservation.partyDate);
        const hours = nextTime.getHours().toString().padStart(2, "0");
        const minutes = nextTime.getMinutes().toString().padStart(2, "0");
        availableAt = `${hours}:${minutes}`;
      }

      // Count total reservations for queue display
      const totalReservations = babyfoot.reservations.filter(
        (r) => r.status === "CONFIRMED" && new Date(r.partyDate) >= now
      ).length;

      return {
        id: babyfoot.id,
        name: babyfoot.name,
        location: babyfoot.location || "Non spécifié",
        status: actualStatus,
        availableAt,
        condition: babyfoot.condition,
        image: "/baby1.png",
        queueCount: totalReservations,
        nextReservationTime: nextReservation ? nextReservation.partyDate.toISOString() : null,
      };
    });
  } catch (error) {
    console.error("Error fetching babyfoots:", error);
    return [];
  }
}
