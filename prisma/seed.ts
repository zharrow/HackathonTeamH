import {
  PrismaClient,
  Roles,
  BabyfootStatus,
  TableCondition,
  ReservationStatus,
  BallType,
  MatchResult,
  MatchFormat,
} from "@/generated/prisma";

const prisma = new PrismaClient();

/**
 * Seed the database with initial data
 * Run with: pnpm db:seed
 */
async function main() {
  console.log("🌱 Starting database seed...");

  const admin = await prisma.user.create({
    data: {
      id: "admin-001",
      email: "admin@ynov.com",
      name: "Admin Ynov",
      emailVerified: true,
      role: Roles.ADMIN,
    },
  });

  const players = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-001",
        email: "alex.martin@ynov.com",
        name: "Alex Martin",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-002",
        email: "sarah.durand@ynov.com",
        name: "Sarah Durand",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-003",
        email: "thomas.bernard@ynov.com",
        name: "Thomas Bernard",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-004",
        email: "marie.dubois@ynov.com",
        name: "Marie Dubois",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-005",
        email: "lucas.petit@ynov.com",
        name: "Lucas Petit",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-006",
        email: "referee@ynov.com",
        name: "Referee 1",
        emailVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${players.length + 1} players (including admin)`);

  // ==================== Create Babyfoots ====================
  console.log("⚽ Creating babyfoots...");

  const babyfoots = await Promise.all([
    prisma.babyfoot.create({
      data: {
        name: "Table Alpha",
        location: "Souk - Zone Gaming",
        status: BabyfootStatus.AVAILABLE,
        condition: TableCondition.EXCELLENT,
      },
    }),
    prisma.babyfoot.create({
      data: {
        name: "Table Beta",
        location: "Souk - Espace Détente",
        status: BabyfootStatus.OCCUPIED,
        condition: TableCondition.BON,
      },
    }),
    prisma.babyfoot.create({
      data: {
        name: "Table Gamma",
        location: "RDC - Hall Principal",
        status: BabyfootStatus.AVAILABLE,
        condition: TableCondition.BON,
      },
    }),
    prisma.babyfoot.create({
      data: {
        name: "Table Delta",
        location: "Souk - Zone Gaming",
        status: BabyfootStatus.MAINTENANCE,
        condition: TableCondition.MAINTENANCE,
      },
    }),
  ]);

  console.log(`✅ Created ${babyfoots.length} babyfoots`);

  // ==================== Create Reservations ====================
  console.log("🎮 Creating reservations...");

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const reservations = await Promise.all([
    // Reservation 1: Rouge gagne (Alex & Sarah vs Thomas & Marie)
    prisma.reservation.create({
      data: {
        babyfootId: babyfoots[0].id,
        partyDate: new Date(now.getTime() - 2 * oneDay),
        status: ReservationStatus.FINISHED,
        tableCondition: TableCondition.EXCELLENT,
        ballType: BallType.PRO,
        refereeId: players[5].id,
        finalScoreRed: 10,
        finalScoreBlue: 5,
        result: MatchResult.WIN,
        redDefenseId: players[0].id, // Alex
        redAttackId: players[1].id, // Sarah
        blueDefenseId: players[2].id, // Thomas
        blueAttackId: players[3].id, // Marie
        format: MatchFormat.TWO_VS_TWO,
      },
    }),
    // Reservation 2: Bleu gagne (Marie & Lucas vs Alex & Thomas)
    prisma.reservation.create({
      data: {
        babyfootId: babyfoots[1].id,
        partyDate: new Date(now.getTime() - oneDay),
        status: ReservationStatus.FINISHED,
        tableCondition: TableCondition.BON,
        ballType: BallType.STANDARD,
        refereeId: players[5].id,
        finalScoreRed: 7,
        finalScoreBlue: 10,
        result: MatchResult.LOSS,
        redDefenseId: players[0].id, // Alex
        redAttackId: players[2].id, // Thomas
        blueDefenseId: players[3].id, // Marie
        blueAttackId: players[4].id, // Lucas
        format: MatchFormat.TWO_VS_TWO,
      },
    }),
    // Reservation 3: Match nul (Sarah & Thomas vs Alex & Marie)
    prisma.reservation.create({
      data: {
        babyfootId: babyfoots[2].id,
        partyDate: new Date(now.getTime() - oneDay / 2),
        status: ReservationStatus.FINISHED,
        tableCondition: TableCondition.BON,
        ballType: BallType.COMPETITION,
        finalScoreRed: 8,
        finalScoreBlue: 8,
        result: MatchResult.DRAW,
        redDefenseId: players[1].id, // Sarah
        redAttackId: players[2].id, // Thomas
        blueDefenseId: players[0].id, // Alex
        blueAttackId: players[3].id, // Marie
        format: MatchFormat.TWO_VS_TWO,
      },
    }),
  ]);

  console.log(`✅ Created ${reservations.length} reservations`);

  // ==================== Create Queue Entries ====================
  console.log("⏳ Creating queue entries...");

  const queueEntries = await Promise.all([
    prisma.queueEntry.create({
      data: {
        userId: players[0].id, // Alex
        babyfootId: babyfoots[1].id, // Table Beta
      },
    }),
    prisma.queueEntry.create({
      data: {
        userId: players[2].id, // Thomas
        babyfootId: babyfoots[1].id, // Table Beta
        notifiedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${queueEntries.length} queue entries`);

  // ==================== Summary ====================
  console.log("\n📊 Seed Summary:");
  console.log(
    `   👥 Players: ${players.length + 1} (${players.length} users + 1 admin)`
  );
  console.log(`   ⚽ Babyfoots: ${babyfoots.length}`);
  console.log(`   🎮 Reservations: ${reservations.length}`);
  console.log(`   ⏳ Queue Entries: ${queueEntries.length}`);
  console.log("\n✨ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
