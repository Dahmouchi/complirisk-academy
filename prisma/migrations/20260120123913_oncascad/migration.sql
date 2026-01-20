-- DropForeignKey
ALTER TABLE "NotesGlobal" DROP CONSTRAINT "NotesGlobal_userId_fkey";

-- AlterTable
ALTER TABLE "LiveRoom" ADD COLUMN     "isQuizPublished" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "NotesGlobal" ADD CONSTRAINT "NotesGlobal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
