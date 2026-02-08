-- CreateEnum
CREATE TYPE "DemandeInscriptionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DemandeInscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "status" "DemandeInscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "treatedAt" TIMESTAMP(3),
    "treatedBy" TEXT,
    "gradeId" TEXT,

    CONSTRAINT "DemandeInscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeInscriptionGrade" (
    "id" TEXT NOT NULL,
    "demandeInscriptionId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "gradePrice" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandeInscriptionGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemandeInscription_userId_idx" ON "DemandeInscription"("userId");

-- CreateIndex
CREATE INDEX "DemandeInscription_status_idx" ON "DemandeInscription"("status");

-- CreateIndex
CREATE INDEX "DemandeInscription_createdAt_idx" ON "DemandeInscription"("createdAt");

-- CreateIndex
CREATE INDEX "DemandeInscriptionGrade_demandeInscriptionId_idx" ON "DemandeInscriptionGrade"("demandeInscriptionId");

-- CreateIndex
CREATE INDEX "DemandeInscriptionGrade_gradeId_idx" ON "DemandeInscriptionGrade"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeInscriptionGrade_demandeInscriptionId_gradeId_key" ON "DemandeInscriptionGrade"("demandeInscriptionId", "gradeId");

-- AddForeignKey
ALTER TABLE "DemandeInscription" ADD CONSTRAINT "DemandeInscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeInscription" ADD CONSTRAINT "DemandeInscription_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeInscriptionGrade" ADD CONSTRAINT "DemandeInscriptionGrade_demandeInscriptionId_fkey" FOREIGN KEY ("demandeInscriptionId") REFERENCES "DemandeInscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeInscriptionGrade" ADD CONSTRAINT "DemandeInscriptionGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
