import { PrismaClient, MatchFormat, ReservationStatus, TableCondition, BallType } from '@prisma/client';

const prisma = new PrismaClient();

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(daysFromNow: number, daysToNow: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * (daysToNow + daysFromNow + 1)) - daysFromNow;
  const date = new Date(now);
  date.setDate(date.getDate() + randomDays);
  return date;
}

export async function seedReservations() {
  console.log('🌱 Seeding reservations...');

  try {
    // Get existing data
    const users = await prisma.user.findMany();
    const babyfoots = await prisma.babyfoot.findMany();

    if (users.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    if (babyfoots.length === 0) {
      console.log('⚠️  No babyfoots found. Please seed babyfoots first.');
      return;
    }

    // Define possible values
    const statuses = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.IN_PROGRESS,
      ReservationStatus.FINISHED,
      ReservationStatus.CANCELLED,
    ];

    const formats = [MatchFormat.ONE_VS_ONE, MatchFormat.ONE_VS_TWO, MatchFormat.TWO_VS_TWO];

    const conditions = [
      TableCondition.EXCELLENT,
      TableCondition.BON,
      TableCondition.MOYEN,
    ];

    const ballTypes = [BallType.STANDARD, BallType.PRO, BallType.COMPETITION];

    // Create reservations
    const reservationsToCreate = Math.min(50, users.length * 2); // Max 50 reservations

    for (let i = 0; i < reservationsToCreate; i++) {
      try {
        const babyfoot = getRandomElement(babyfoots);
        const status = getRandomElement(statuses);
        const format = getRandomElement(formats);

        // Determine how many players we need based on format
        let playersNeeded: number;
        if (format === MatchFormat.ONE_VS_ONE) {
          playersNeeded = 2;
        } else if (format === MatchFormat.ONE_VS_TWO) {
          playersNeeded = 3;
        } else if (format === MatchFormat.TWO_VS_TWO) {
          playersNeeded = 4;
        } else {
          playersNeeded = 2; // fallback
        }

        const selectedPlayers = getRandomElements(users, playersNeeded);

        // Generate date based on status
        let partyDate: Date;
        if (
          status === ReservationStatus.FINISHED ||
          status === ReservationStatus.CANCELLED
        ) {
          partyDate = getRandomDate(30, 0); // Past reservations
        } else if (status === ReservationStatus.IN_PROGRESS) {
          partyDate = new Date(); // Current
        } else {
          partyDate = getRandomDate(0, 30); // Future reservations
        }

        // Build reservation data
        const reservationData: any = {
          babyfootId: babyfoot.id,
          partyDate,
          status,
          tableCondition: getRandomElement(conditions),
          ballType: getRandomElement(ballTypes),
          format,
        };

        // Assign players based on format
        if (format === MatchFormat.ONE_VS_ONE) {
          reservationData.redDefenseId = selectedPlayers[0].id;
          reservationData.blueDefenseId = selectedPlayers[1].id;
        } else if (format === MatchFormat.ONE_VS_TWO) {
          reservationData.redDefenseId = selectedPlayers[0].id;
          reservationData.blueDefenseId = selectedPlayers[1].id;
          reservationData.blueAttackId = selectedPlayers[2].id;
        } else if (format === MatchFormat.TWO_VS_TWO) {
          // TWO_VS_TWO
          reservationData.redDefenseId = selectedPlayers[0].id;
          reservationData.redAttackId = selectedPlayers[1].id;
          reservationData.blueDefenseId = selectedPlayers[2].id;
          reservationData.blueAttackId = selectedPlayers[3].id;
        }

        // Add referee (30% chance)
        if (Math.random() > 0.7) {
          const referee = getRandomElement(
            users.filter(
              (u) =>
                u.id !== reservationData.redDefenseId &&
                u.id !== reservationData.blueDefenseId &&
                u.id !== reservationData.redAttackId &&
                u.id !== reservationData.blueAttackId
            )
          );
          if (referee) {
            reservationData.refereeId = referee.id;
          }
        }

        // Add match result for finished games
        if (status === ReservationStatus.FINISHED) {
          const results = ['WIN', 'LOSS', 'DRAW'];
          reservationData.matchResult = getRandomElement(results);
        }

        // Create the reservation
        await prisma.reservation.create({
          data: reservationData,
        });

        console.log(`✅ Created reservation ${i + 1}/${reservationsToCreate}`);
      } catch (error) {
        console.error(`❌ Error creating reservation ${i + 1}:`, error);
      }
    }

    console.log(`🎉 Successfully seeded ${reservationsToCreate} reservations!`);
  } catch (error) {
    console.error('❌ Error seeding reservations:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedReservations()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
