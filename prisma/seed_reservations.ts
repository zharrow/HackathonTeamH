import {
  PrismaClient,
  ReservationStatus,
  TableCondition,
  BallType,
  MatchResult,
  MatchFormat,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Generate random reservations based on existing users and babyfoot tables
 * Run with: pnpm db:seed-reservations
 */
async function main() {
  console.log("🎮 Starting reservations seed...");

  // ==================== Fetch existing data ====================
  console.log("📖 Fetching existing users and tables...");

  const users = await prisma.user.findMany();
  const babyfoots = await prisma.babyfoot.findMany();

  if (users.length < 4) {
    console.error(
      "❌ Error: Need at least 4 users in database. Run db:seed-users first."
    );
    process.exit(1);
  }

  if (babyfoots.length === 0) {
    console.error(
      "❌ Error: Need at least 1 babyfoot table in database. Run db:seed-tables first."
    );
    process.exit(1);
  }

  console.log(`✅ Found ${users.length} users and ${babyfoots.length} tables`);

  // ==================== Helper functions ====================

  /**
   * Get random element from array
   */
  function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get N random unique elements from array
   */
  function getRandomElements<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Generate a random date within a range
   */
  function getRandomDate(daysBack: number, daysForward: number): Date {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const minDate = now - daysBack * oneDay;
    const maxDate = now + daysForward * oneDay;
    return new Date(minDate + Math.random() * (maxDate - minDate));
  }

  // ==================== Generate Reservations ====================
  console.log("🎮 Creating reservations...");

  const reservationsToCreate = 50; // Generate 50 reservations
  let successCount = 0;
  let errorCount = 0;

  const statuses = [
    ReservationStatus.FINISHED,
    ReservationStatus.FINISHED,
    ReservationStatus.FINISHED, // More finished
    ReservationStatus.CONFIRMED,
    ReservationStatus.IN_PROGRESS,
    ReservationStatus.PENDING,
    ReservationStatus.CANCELLED,
  ];

  const conditions = [
    TableCondition.EXCELLENT,
    TableCondition.BON,
    TableCondition.MOYEN,
  ];

  const ballTypes = [BallType.STANDARD, BallType.PRO, BallType.COMPETITION];

  const formats = [
    MatchFormat.ONE_VS_ONE,
    MatchFormat.TWO_VS_TWO,
    MatchFormat.TWO_VS_TWO, // More 2v2
  ];

  for (let i = 0; i < reservationsToCreate; i++) {
    try {
      const babyfoot = getRandomElement(babyfoots);
      const status = getRandomElement(statuses);
      const format = getRandomElement(formats);

      // Determine how many players we need based on format
      const playersNeeded =
        format === MatchFormat.ONE_VS_ONE
          ? 2
          : format === MatchFormat.ONE_VS_TWO
          ? 3
          : 4;

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
      } else {
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
              u.id !== reservationData.redAttackId &&
              u.id !== reservationData.blueDefenseId &&
              u.id !== reservationData.blueAttackId
          )
        );
        if (referee) {
          reservationData.refereeId = referee.id;
        }
      }

      // Add scores and results for FINISHED matches
      if (status === ReservationStatus.FINISHED) {
        const redScore = Math.floor(Math.random() * 11); // 0-10
        const blueScore = Math.floor(Math.random() * 11); // 0-10

        reservationData.finalScoreRed = redScore;
        reservationData.finalScoreBlue = blueScore;

        if (redScore > blueScore) {
          reservationData.result = MatchResult.WIN;
        } else if (blueScore > redScore) {
          reservationData.result = MatchResult.LOSS;
        } else {
          reservationData.result = MatchResult.DRAW;
        }
      }

      // Create the reservation
      await prisma.reservation.create({
        data: reservationData,
      });

      successCount++;
      if (successCount % 10 === 0) {
        console.log(`✅ Created ${successCount} reservations so far...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error creating reservation #${i + 1}:`, error);
    }
  }

  // ==================== Summary ====================
  console.log("\n📊 Seed Summary:");
  console.log(`   ✅ Successfully created: ${successCount} reservations`);
  console.log(`   ❌ Errors: ${errorCount} reservations`);
  console.log(`   🎯 Target: ${reservationsToCreate} reservations`);
  console.log("\n✨ Reservations seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding reservations:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
