"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { DemandeInscriptionStatus } from "@prisma/client";

export async function getDemandes() {
  try {
    const demandes = await prisma.demandeInscription.findMany({
      include: {
        user: true,
        grades: {
          include: {
            grade: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: demandes };
  } catch (error) {
    console.error("Error fetching demandes:", error);
    return { success: false, data: [], error: "Failed to fetch demandes" };
  }
}

export async function approveDemande(demandeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const demande = await prisma.demandeInscription.findUnique({
      where: { id: demandeId },
      include: {
        grades: true,
      },
    });

    if (!demande) {
      return { success: false, error: "Demande non trouvée" };
    }

    // 1. Update the demande status
    await prisma.demandeInscription.update({
      where: { id: demandeId },
      data: {
        status: "APPROVED",
        treatedAt: new Date(),
        treatedBy: session.user.id,
      },
    });

    // 2. Connect grades to the user
    // First, get all grade IDs from the demande
    const gradeIds = demande.grades.map((dg) => dg.gradeId);

    await prisma.user.update({
      where: { id: demande.userId },
      data: {
        grades: {
          connect: gradeIds.map((id) => ({ id })),
        },
        StatutUser: "verified",
      },
    });

    revalidatePath("/admin/dashboard/demandes");
    revalidatePath("/admin/dashboard/users");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Demande approuvée avec succès" };
  } catch (error) {
    console.error("Error approving demande:", error);
    return { success: false, error: "Failed to approve demande" };
  }
}

export async function rejectDemande(demandeId: string, reason?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.demandeInscription.update({
      where: { id: demandeId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        treatedAt: new Date(),
        treatedBy: session.user.id,
      },
    });

    revalidatePath("/admin/dashboard/demandes");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Demande rejetée" };
  } catch (error) {
    console.error("Error rejecting demande:", error);
    return { success: false, error: "Failed to reject demande" };
  }
}

export async function deleteDemande(demandeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.demandeInscription.delete({
      where: { id: demandeId },
    });

    revalidatePath("/admin/dashboard/demandes");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Demande supprimée" };
  } catch (error) {
    console.error("Error deleting demande:", error);
    return { success: false, error: "Failed to delete demande" };
  }
}

export async function getPendingDemandesCount() {
  try {
    const count = await prisma.demandeInscription.count({
      where: {
        status: "PENDING",
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error counting pending demandes:", error);
    return {
      success: false,
      count: 0,
      error: "Failed to count pending demandes",
    };
  }
}
