import { PrismaClient, BabyfootStatus, TableCondition } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

interface TableData {
  location: string;
  latest_table_condition: string;
}

interface TablesJson {
  tempsbabyfoot: TableData[];
}

/**
 * Map JSON condition strings to TableCondition enum
 */
function mapCondition(condition: string): TableCondition {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition === "new" || lowerCondition === "excellent") {
    return TableCondition.EXCELLENT;
  } else if (lowerCondition === "good" || lowerCondition === "bon") {
    return TableCondition.BON;
  } else {
    // "out of alignment", "needs cleaning", etc.
    return TableCondition.MOYEN;
  }
}

/**
 * Generate a table name based on location and index
 */
function generateTableName(location: string, index: number): string {
  // Extract a short identifier from location
  const words = location.split(/[\s-]+/);
  const prefix = words[0] || "Table";
  return `${prefix} ${String.fromCharCode(65 + index)}`; // A, B, C, etc.
}

/**
 * Feed babyfoot tables from tables.json into the database
 * Run with: pnpm db:seed-tables
 */
async function main() {
  console.log("⚽ Starting babyfoot tables import from JSON...");

  // Read the JSON file
  const jsonPath = join(__dirname, "tables.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  const data: TablesJson = JSON.parse(jsonContent);

  console.log(`📖 Found ${data.tempsbabyfoot.length} tables in JSON file`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process tables one by one
  for (let i = 0; i < data.tempsbabyfoot.length; i++) {
    const tableData = data.tempsbabyfoot[i];

    try {
      // Generate table name
      const tableName = generateTableName(tableData.location, i);

      // Check if table with same name or location already exists
      const existingTable = await prisma.babyfoot.findFirst({
        where: {
          OR: [{ name: tableName }, { location: tableData.location }],
        },
      });

      if (existingTable) {
        skipCount++;
        console.log(`⏭️  Skipped (already exists): ${tableData.location}`);
        continue;
      }

      // Map condition string to enum
      const condition = mapCondition(tableData.latest_table_condition);

      // Create the babyfoot table with proper data structure
      // Note: Even with @default(uuid()) in schema, TypeScript requires id to be provided
      // Auto-generated fields by Prisma:
      // - status (has @default(AVAILABLE))
      await prisma.babyfoot.create({
        data: {
          name: tableName,
          location: tableData.location,
          condition: condition,
          status: BabyfootStatus.AVAILABLE,
        },
      });

      successCount++;
      console.log(`✅ Imported: ${tableName} at ${tableData.location}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing ${tableData.location}:`, error);
    }
  }

  // ==================== Summary ====================
  console.log("\n📊 Import Summary:");
  console.log(`   ✅ Successfully imported: ${successCount} tables`);
  console.log(`   ⏭️  Skipped (already exist): ${skipCount} tables`);
  console.log(`   ❌ Errors: ${errorCount} tables`);
  console.log(`   📖 Total in JSON: ${data.tempsbabyfoot.length} tables`);
  console.log("\n✨ Babyfoot tables import completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error importing tables:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
