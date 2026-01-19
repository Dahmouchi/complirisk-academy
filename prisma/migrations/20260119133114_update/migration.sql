/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,subjectId,gradeId]` on the table `TeacherSubject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gradeId` to the `TeacherSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TeacherSubject_teacherId_subjectId_key";

-- AlterTable
ALTER TABLE "TeacherSubject" ADD COLUMN     "gradeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TeacherSubject_gradeId_idx" ON "TeacherSubject"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_teacherId_subjectId_gradeId_key" ON "TeacherSubject"("teacherId", "subjectId", "gradeId");

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
