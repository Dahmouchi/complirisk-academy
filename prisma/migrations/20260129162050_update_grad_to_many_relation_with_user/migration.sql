/*
  Warnings:

  - You are about to drop the column `gradeId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gradeId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gradeId";

-- CreateTable
CREATE TABLE "_GradeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GradeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GradeToUser_B_index" ON "_GradeToUser"("B");

-- AddForeignKey
ALTER TABLE "_GradeToUser" ADD CONSTRAINT "_GradeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToUser" ADD CONSTRAINT "_GradeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
