/*
  Warnings:

  - You are about to drop the `Babyfoot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QueueEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."QueueEntry" DROP CONSTRAINT "QueueEntry_babyfootId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QueueEntry" DROP CONSTRAINT "QueueEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_babyfootId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- DropTable
DROP TABLE "public"."Babyfoot";

-- DropTable
DROP TABLE "public"."QueueEntry";

-- DropTable
DROP TABLE "public"."Reservation";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."BabyfootStatus";

-- DropEnum
DROP TYPE "public"."MatchFormat";

-- DropEnum
DROP TYPE "public"."MatchResult";

-- DropEnum
DROP TYPE "public"."ReservationStatus";

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "surname" TEXT,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "profile_pic" TEXT,
    "elo" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_condition" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "table_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "condition_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balls" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "party_date" TIMESTAMP(3) NOT NULL,
    "table_condition_id" TEXT NOT NULL,
    "ball_type_id" TEXT NOT NULL,
    "referee_id" TEXT,
    "game_duration" INTEGER,
    "final_score_red" INTEGER NOT NULL,
    "final_score_blue" INTEGER NOT NULL,
    "result_id" TEXT NOT NULL,
    "red_defense_id" TEXT NOT NULL,
    "red_attack_id" TEXT NOT NULL,
    "blue_defense_id" TEXT NOT NULL,
    "blue_attack_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_entry" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "notified_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "queue_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_clerkId_key" ON "player"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "player_email_key" ON "player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "player_username_key" ON "player"("username");

-- CreateIndex
CREATE INDEX "player_elo_idx" ON "player"("elo");

-- CreateIndex
CREATE INDEX "player_clerkId_idx" ON "player"("clerkId");

-- CreateIndex
CREATE INDEX "player_username_idx" ON "player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tables_name_key" ON "tables"("name");

-- CreateIndex
CREATE INDEX "tables_condition_id_idx" ON "tables"("condition_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_text_key" ON "result"("text");

-- CreateIndex
CREATE INDEX "party_table_id_idx" ON "party"("table_id");

-- CreateIndex
CREATE INDEX "party_party_date_idx" ON "party"("party_date");

-- CreateIndex
CREATE INDEX "party_result_id_idx" ON "party"("result_id");

-- CreateIndex
CREATE INDEX "party_red_defense_id_idx" ON "party"("red_defense_id");

-- CreateIndex
CREATE INDEX "party_red_attack_id_idx" ON "party"("red_attack_id");

-- CreateIndex
CREATE INDEX "party_blue_defense_id_idx" ON "party"("blue_defense_id");

-- CreateIndex
CREATE INDEX "party_blue_attack_id_idx" ON "party"("blue_attack_id");

-- CreateIndex
CREATE INDEX "party_referee_id_idx" ON "party"("referee_id");

-- CreateIndex
CREATE INDEX "queue_entry_table_id_created_at_idx" ON "queue_entry"("table_id", "created_at");

-- CreateIndex
CREATE INDEX "queue_entry_player_id_idx" ON "queue_entry"("player_id");

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "table_condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_table_condition_id_fkey" FOREIGN KEY ("table_condition_id") REFERENCES "table_condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_ball_type_id_fkey" FOREIGN KEY ("ball_type_id") REFERENCES "balls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_red_defense_id_fkey" FOREIGN KEY ("red_defense_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_red_attack_id_fkey" FOREIGN KEY ("red_attack_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_blue_defense_id_fkey" FOREIGN KEY ("blue_defense_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_blue_attack_id_fkey" FOREIGN KEY ("blue_attack_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_entry" ADD CONSTRAINT "queue_entry_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_entry" ADD CONSTRAINT "queue_entry_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
