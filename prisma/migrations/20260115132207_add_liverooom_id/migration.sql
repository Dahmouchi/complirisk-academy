/*
  Warnings:

  - You are about to drop the `_LiveRoomToQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LiveRoomToQuiz" DROP CONSTRAINT "_LiveRoomToQuiz_A_fkey";

-- DropForeignKey
ALTER TABLE "_LiveRoomToQuiz" DROP CONSTRAINT "_LiveRoomToQuiz_B_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "liveRoomId" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- DropTable
DROP TABLE "_LiveRoomToQuiz";

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_liveRoomId_fkey" FOREIGN KEY ("liveRoomId") REFERENCES "LiveRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
