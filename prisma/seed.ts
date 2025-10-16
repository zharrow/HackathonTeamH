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
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seed the database with initial data
 * Run with: pnpm db:seed
 */
async function main() {
  console.log("🌱 Starting database seed...");

  // Hash password for all demo users (password: "password123")
  const hashedPassword = await hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@ynov.com",
      name: "Admin",
      surname: "Ynov",
      name: "admin_ynov",
      password: hashedPassword,
      emailVerified: true,
      role: Roles.ADMIN,
      elo: 1200,
      wins: 25,
      losses: 15,
    },
  });

  const players = await Promise.all([
    prisma.user.create({
      data: {
        email: "alex.martin@ynov.com",
        name: "Alex",
        surname: "Martin",
        name: "alex_thechamp",
        password: hashedPassword,
        emailVerified: true,
        elo: 1450,
        wins: 42,
        losses: 18,
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah.durand@ynov.com",
        name: "Sarah",
        name: "sarah_pro",
        password: hashedPassword,
        elo: 1380,
        wins: 35,
        losses: 22,
      },
    }),
    prisma.user.create({
      data: {
        email: "thomas.bernard@ynov.com",
        name: "thomas_gg",
        password: hashedPassword,
        elo: 1250,
        wins: 28,
        losses: 25,
      },
    }),
    prisma.user.create({
      data: {
        email: "marie.dubois@ynov.com",,
        name: "marie_mvp",
        password: hashedPassword,
        emailVerified: new Date(),
        elo: 1520,
        wins: 48,
        losses: 15,
      },
    }),
    prisma.user.create({
      data: {
        email: "lucas.petit@ynov.com",
        name: "lucas_noob",
        password: hashedPassword,
        emailVerified: new Date(),
        elo: 980,
        wins: 12,
        losses: 30,
      },
    }),
    prisma.user.create({
      data: {
        email: "referee@ynov.com",
        name: "referee_1",
        password: hashedPassword,
        emailVerified: new Date(),
        elo: 1000,
        wins: 0,
        losses: 0,
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
