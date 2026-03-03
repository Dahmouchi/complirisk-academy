-- CreateEnum
CREATE TYPE "DemandePackEntrepriseStatus" AS ENUM ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ModeFormation" AS ENUM ('PRESENTIEL', 'CLASSE_VIRTUELLE', 'HYBRIDE');

-- CreateTable
CREATE TABLE "DemandePackEntreprise" (
    "id" TEXT NOT NULL,
    "raisonSociale" TEXT NOT NULL,
    "secteurActivite" TEXT NOT NULL,
    "villePayse" TEXT NOT NULL,
    "nomPrenom" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "emailProfessionnel" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "thematiques" TEXT NOT NULL,
    "populationCiblee" TEXT,
    "nombreParticipants" INTEGER,
    "modeFormation" "ModeFormation" NOT NULL DEFAULT 'PRESENTIEL',
    "consentementContact" BOOLEAN NOT NULL DEFAULT false,
    "consentementNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "status" "DemandePackEntrepriseStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "rejectionReason" TEXT,
    "treatedAt" TIMESTAMP(3),
    "treatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandePackEntreprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemandePackEntreprise_status_idx" ON "DemandePackEntreprise"("status");

-- CreateIndex
CREATE INDEX "DemandePackEntreprise_createdAt_idx" ON "DemandePackEntreprise"("createdAt");

-- CreateIndex
CREATE INDEX "DemandePackEntreprise_emailProfessionnel_idx" ON "DemandePackEntreprise"("emailProfessionnel");
