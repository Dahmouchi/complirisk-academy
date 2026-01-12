/*
  Warnings:

  - A unique constraint covering the columns `[livekitRoom]` on the table `LiveRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "LiveStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "LiveRoom" DROP CONSTRAINT "LiveRoom_teacherId_fkey";

-- AlterTable
ALTER TABLE "LiveRoom" ADD COLUMN     "chatEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "gradeId" TEXT,
ADD COLUMN     "maxParticipants" INTEGER DEFAULT 100,
ADD COLUMN     "recordingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subjectId" TEXT,
ALTER COLUMN "type" SET DEFAULT 'LIVEKIT';

-- CreateTable
CREATE TABLE "LiveRoomParticipant" (
    "id" TEXT NOT NULL,
    "liveRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "LiveRoomParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveRoomParticipant_liveRoomId_idx" ON "LiveRoomParticipant"("liveRoomId");

-- CreateIndex
CREATE INDEX "LiveRoomParticipant_userId_idx" ON "LiveRoomParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRoomParticipant_liveRoomId_userId_key" ON "LiveRoomParticipant"("liveRoomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRoom_livekitRoom_key" ON "LiveRoom"("livekitRoom");

-- CreateIndex
CREATE INDEX "LiveRoom_teacherId_idx" ON "LiveRoom"("teacherId");

-- CreateIndex
CREATE INDEX "LiveRoom_subjectId_idx" ON "LiveRoom"("subjectId");

-- CreateIndex
CREATE INDEX "LiveRoom_status_idx" ON "LiveRoom"("status");

-- AddForeignKey
ALTER TABLE "LiveRoom" ADD CONSTRAINT "LiveRoom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveRoom" ADD CONSTRAINT "LiveRoom_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveRoom" ADD CONSTRAINT "LiveRoom_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveRoomParticipant" ADD CONSTRAINT "LiveRoomParticipant_liveRoomId_fkey" FOREIGN KEY ("liveRoomId") REFERENCES "LiveRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveRoomParticipant" ADD CONSTRAINT "LiveRoomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
