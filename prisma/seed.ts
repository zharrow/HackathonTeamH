import { PrismaClient, Role } from "@/generated/prisma";

const prisma = new PrismaClient();

/**
 * Seed the database with initial data
 * Run with: pnpm db:seed
 */
async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (in development)
  console.log("🧹 Cleaning existing data...");
  await prisma.queueEntry.deleteMany();
  await prisma.party.deleteMany();
  await prisma.result.deleteMany();
  await prisma.ballType.deleteMany();
  await prisma.table.deleteMany();
  await prisma.tableCondition.deleteMany();
  await prisma.player.deleteMany();

  // ==================== Create Players ====================
  console.log("👥 Creating players...");

  const admin = await prisma.player.create({
    data: {
      clerkId: "clerk_admin_mock_001",
      email: "admin@ynov.com",
      name: "Admin",
      surname: "Ynov",
      username: "admin_ynov",
      role: Role.ADMIN,
      elo: 1200,
      wins: 25,
      losses: 15,
    },
  });

  const players = await Promise.all([
    prisma.player.create({
      data: {
        clerkId: "clerk_user_mock_001",
        email: "alex.martin@ynov.com",
        name: "Alex",
        surname: "Martin",
        username: "alex_thechamp",
        elo: 1450,
        wins: 42,
        losses: 18,
      },
    }),
    prisma.player.create({
      data: {
        clerkId: "clerk_user_mock_002",
        email: "sarah.durand@ynov.com",
        name: "Sarah",
        surname: "Durand",
        username: "sarah_pro",
        elo: 1380,
        wins: 35,
        losses: 22,
      },
    }),
    prisma.player.create({
      data: {
        clerkId: "clerk_user_mock_003",
        email: "thomas.bernard@ynov.com",
        name: "Thomas",
        surname: "Bernard",
        username: "thomas_gg",
        elo: 1250,
        wins: 28,
        losses: 25,
      },
    }),
    prisma.player.create({
      data: {
        clerkId: "clerk_user_mock_004",
        email: "marie.dubois@ynov.com",
        name: "Marie",
        surname: "Dubois",
        username: "marie_mvp",
        elo: 1520,
        wins: 48,
        losses: 15,
      },
    }),
    prisma.player.create({
      data: {
        clerkId: "clerk_user_mock_005",
        email: "lucas.petit@ynov.com",
        name: "Lucas",
        surname: "Petit",
        username: "lucas_noob",
        elo: 980,
        wins: 12,
        losses: 30,
      },
    }),
    prisma.player.create({
      data: {
        email: "referee@ynov.com",
        name: "Referee",
        surname: "Official",
        username: "referee_1",
        elo: 1000,
        wins: 0,
        losses: 0,
      },
    }),
  ]);

  console.log(`✅ Created ${players.length + 1} players (including admin)`);

  // ==================== Create Table Conditions ====================
  console.log("🔧 Creating table conditions...");

  const conditions = await Promise.all([
    prisma.tableCondition.create({
      data: { description: "Excellent" },
    }),
    prisma.tableCondition.create({
      data: { description: "Bon" },
    }),
    prisma.tableCondition.create({
      data: { description: "Moyen" },
    }),
    prisma.tableCondition.create({
      data: { description: "Nécessite maintenance" },
    }),
  ]);

  console.log(`✅ Created ${conditions.length} table conditions`);

  // ==================== Create Tables ====================
  console.log("⚽ Creating tables...");

  const tables = await Promise.all([
    prisma.table.create({
      data: {
        name: "Table Alpha",
        location: "Souk - Zone Gaming",
        conditionId: conditions[0].id, // Excellent
      },
    }),
    prisma.table.create({
      data: {
        name: "Table Beta",
        location: "Souk - Espace Détente",
        conditionId: conditions[1].id, // Bon
      },
    }),
    prisma.table.create({
      data: {
        name: "Table Gamma",
        location: "RDC - Hall Principal",
        conditionId: conditions[1].id, // Bon
      },
    }),
    prisma.table.create({
      data: {
        name: "Table Delta",
        location: "Souk - Zone Gaming",
        conditionId: conditions[3].id, // Nécessite maintenance
      },
    }),
  ]);

  console.log(`✅ Created ${tables.length} tables`);

  // ==================== Create Ball Types ====================
  console.log("⚾ Creating ball types...");

  const ballTypes = await Promise.all([
    prisma.ballType.create({
      data: { description: "Standard" },
    }),
    prisma.ballType.create({
      data: { description: "Pro" },
    }),
    prisma.ballType.create({
      data: { description: "Competition" },
    }),
  ]);

  console.log(`✅ Created ${ballTypes.length} ball types`);

  // ==================== Create Results ====================
  console.log("🏆 Creating results...");

  const results = await Promise.all([
    prisma.result.create({
      data: { text: "Victoire Rouge" },
    }),
    prisma.result.create({
      data: { text: "Victoire Bleue" },
    }),
    prisma.result.create({
      data: { text: "Match Nul" },
    }),
  ]);

  console.log(`✅ Created ${results.length} results`);

  // ==================== Create Parties ====================
  console.log("🎮 Creating parties...");

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const parties = await Promise.all([
    // Partie 1: Rouge gagne (Alex & Sarah vs Thomas & Marie)
    prisma.party.create({
      data: {
        tableId: tables[0].id,
        partyDate: new Date(now.getTime() - 2 * oneDay),
        tableConditionId: conditions[0].id,
        ballTypeId: ballTypes[1].id, // Pro
        refereeId: players[5].id, // Referee
        gameDuration: 15,
        finalScoreRed: 10,
        finalScoreBlue: 5,
        resultId: results[0].id, // Victoire Rouge
        redDefenseId: players[0].id, // Alex
        redAttackId: players[1].id, // Sarah
        blueDefenseId: players[2].id, // Thomas
        blueAttackId: players[3].id, // Marie
      },
    }),
    // Partie 2: Bleu gagne (Marie & Lucas vs Alex & Thomas)
    prisma.party.create({
      data: {
        tableId: tables[1].id,
        partyDate: new Date(now.getTime() - oneDay),
        tableConditionId: conditions[1].id,
        ballTypeId: ballTypes[0].id, // Standard
        refereeId: players[5].id,
        gameDuration: 20,
        finalScoreRed: 7,
        finalScoreBlue: 10,
        resultId: results[1].id, // Victoire Bleue
        redDefenseId: players[0].id, // Alex
        redAttackId: players[2].id, // Thomas
        blueDefenseId: players[3].id, // Marie
        blueAttackId: players[4].id, // Lucas
      },
    }),
    // Partie 3: Match nul (Sarah & Thomas vs Alex & Marie)
    prisma.party.create({
      data: {
        tableId: tables[2].id,
        partyDate: new Date(now.getTime() - oneDay / 2),
        tableConditionId: conditions[1].id,
        ballTypeId: ballTypes[2].id, // Competition
        gameDuration: 18,
        finalScoreRed: 8,
        finalScoreBlue: 8,
        resultId: results[2].id, // Match Nul
        redDefenseId: players[1].id, // Sarah
        redAttackId: players[2].id, // Thomas
        blueDefenseId: players[0].id, // Alex
        blueAttackId: players[3].id, // Marie
      },
    }),
  ]);

  console.log(`✅ Created ${parties.length} parties`);

  // ==================== Create Queue Entries ====================
  console.log("⏳ Creating queue entries...");

  const queueEntries = await Promise.all([
    prisma.queueEntry.create({
      data: {
        playerId: players[0].id, // Alex
        tableId: tables[1].id, // Table Beta
      },
    }),
    prisma.queueEntry.create({
      data: {
        playerId: players[2].id, // Thomas
        tableId: tables[1].id, // Table Beta
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
  console.log(`   🔧 Table Conditions: ${conditions.length}`);
  console.log(`   ⚽ Tables: ${tables.length}`);
  console.log(`   ⚾ Ball Types: ${ballTypes.length}`);
  console.log(`   🏆 Results: ${results.length}`);
  console.log(`   🎮 Parties: ${parties.length}`);
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
