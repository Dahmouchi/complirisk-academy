"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { DemandePackEntrepriseStatus, ModeFormation } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DemandePackEntrepriseFormData = {
  // Informations entreprise
  raisonSociale: string;
  secteurActivite: string;
  villePayse: string;

  // Contact principal
  nomPrenom: string;
  fonction: string;
  emailProfessionnel: string;
  telephone: string;

  // Besoins formation
  thematiques: string;
  populationCiblee?: string;
  nombreParticipants?: number;
  modeFormation: ModeFormation;

  // Consentement
  consentementContact: boolean;
  consentementNewsletter: boolean;
};

// ─── Public action (no auth required) ────────────────────────────────────────

export async function submitDemandePackEntreprise(
  data: DemandePackEntrepriseFormData,
) {
  try {
    // Basic validation
    if (!data.consentementContact) {
      return {
        success: false,
        error: "Vous devez accepter d'être contacté pour soumettre la demande.",
      };
    }

    const demande = await prisma.demandePackEntreprise.create({
      data: {
        raisonSociale: data.raisonSociale.trim(),
        secteurActivite: data.secteurActivite.trim(),
        villePayse: data.villePayse.trim(),
        nomPrenom: data.nomPrenom.trim(),
        fonction: data.fonction.trim(),
        emailProfessionnel: data.emailProfessionnel.trim().toLowerCase(),
        telephone: data.telephone.trim(),
        thematiques: data.thematiques.trim(),
        populationCiblee: data.populationCiblee?.trim() || null,
        nombreParticipants: data.nombreParticipants ?? null,
        modeFormation: data.modeFormation,
        consentementContact: data.consentementContact,
        consentementNewsletter: data.consentementNewsletter,
      },
    });

    revalidatePath("/admin/dashboard/demandes-entreprise");

    return {
      success: true,
      message:
        "Merci. Nous vous recontactons sous 24–48h avec une proposition et une estimation.",
      data: demande,
    };
  } catch (error) {
    console.error("Error submitting DemandePackEntreprise:", error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

// ─── Admin actions (auth required) ───────────────────────────────────────────

export async function getDemandesPackEntreprise() {
  try {
    const demandes = await prisma.demandePackEntreprise.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: demandes };
  } catch (error) {
    console.error("Error fetching DemandesPackEntreprise:", error);
    return {
      success: false,
      data: [],
      error: "Erreur lors du chargement des demandes.",
    };
  }
}

export async function updateDemandePackEntrepriseStatus(
  demandeId: string,
  status: DemandePackEntrepriseStatus,
  reason?: string,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Non autorisé" };
    }

    await prisma.demandePackEntreprise.update({
      where: { id: demandeId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? (reason ?? null) : null,
        treatedAt: new Date(),
        treatedBy: session.user.id,
      },
    });

    revalidatePath("/admin/dashboard/demandes-entreprise");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Statut mis à jour avec succès." };
  } catch (error) {
    console.error("Error updating DemandePackEntreprise status:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

export async function deleteDemandePackEntreprise(demandeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Non autorisé" };
    }

    await prisma.demandePackEntreprise.delete({
      where: { id: demandeId },
    });

    revalidatePath("/admin/dashboard/demandes-entreprise");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Demande supprimée." };
  } catch (error) {
    console.error("Error deleting DemandePackEntreprise:", error);
    return { success: false, error: "Erreur lors de la suppression." };
  }
}

export async function getPendingDemandesPackEntrepriseCount() {
  try {
    const count = await prisma.demandePackEntreprise.count({
      where: { status: "PENDING" },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error counting pending DemandesPackEntreprise:", error);
    return {
      success: false,
      count: 0,
      error: "Erreur lors du comptage.",
    };
  }
}
