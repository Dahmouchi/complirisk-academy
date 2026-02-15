-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "formateurId" TEXT;

-- CreateTable
CREATE TABLE "Formateur" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "bio" TEXT,
    "specialite" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Grade_formateurId_idx" ON "Grade"("formateurId");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "Formateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
