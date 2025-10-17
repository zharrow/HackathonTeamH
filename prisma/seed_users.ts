import { PrismaClient, Roles } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

interface UserData {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  wins: number;
  losses: number;
  draws: number;
  elo: number;
}

interface UsersJson {
  users: UserData[];
}

/**
 * Feed users from users.json into the database
 * Run with: pnpm db:feed-users
 */
async function main() {
  console.log("🌱 Starting users import from JSON...");

  // Read the JSON file
  const jsonPath = join(__dirname, "users.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  const data: UsersJson = JSON.parse(jsonContent);

  console.log(`📖 Found ${data.users.length} users in JSON file`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process users in batches to avoid overwhelming the database
  const batchSize = 50;
  for (let i = 0; i < data.users.length; i += batchSize) {
    const batch = data.users.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (userData) => {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
          });

          if (existingUser) {
            skipCount++;
            console.log(`⏭️  Skipped (already exists): ${userData.email}`);
            return;
          }

          // Create the user with proper data structure
          // Note: Even with @default(uuid()) in schema, TypeScript requires id to be provided
          // Auto-generated fields by Prisma:
          // - createdAt (has @default(now()))
          // - created_at (has @default(now()))
          // - elo, wins, losses, draws (have @default() values but we override them)
          await prisma.user.create({
            data: {
              id: randomUUID(),
              name: userData.name,
              email: userData.email,
              emailVerified: true,
              role: userData.role === "ADMIN" ? Roles.ADMIN : Roles.USER,
              elo: Math.round(userData.elo),
              wins: userData.wins,
              losses: userData.losses,
              draws: userData.draws,
            },
          });

          successCount++;
          if (successCount % 100 === 0) {
            console.log(`✅ Imported ${successCount} users so far...`);
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error importing ${userData.email}:`, error);
        }
      })
    );
  }

  // ==================== Summary ====================
  console.log("\n📊 Import Summary:");
  console.log(`   ✅ Successfully imported: ${successCount} users`);
  console.log(`   ⏭️  Skipped (already exist): ${skipCount} users`);
  console.log(`   ❌ Errors: ${errorCount} users`);
  console.log(`   📖 Total in JSON: ${data.users.length} users`);
  console.log("\n✨ Users import completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error importing users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
