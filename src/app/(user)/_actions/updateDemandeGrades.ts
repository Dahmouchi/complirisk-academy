"use server";

import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateDemandeGrades(
  demandeId: string,
  gradeIds: string[],
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Verify the demande belongs to the user
    const demande = await prisma.demandeInscription.findUnique({
      where: { id: demandeId },
      include: {
        grades: true,
      },
    });

    if (!demande) {
      return { success: false, error: "Demande introuvable" };
    }

    if (demande.userId !== session.user.id) {
      return { success: false, error: "Non autorisé" };
    }

    if (demande.status !== "PENDING") {
      return {
        success: false,
        error: "Vous ne pouvez modifier qu'une demande en attente",
      };
    }

    // Fetch grade prices
    const grades = await prisma.grade.findMany({
      where: {
        id: {
          in: gradeIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    const totalPrice = grades.reduce(
      (sum: number, grade: { price: number }) => sum + grade.price,
      0,
    );

    // Update the demande in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Delete existing grade associations
      await tx.demandeInscriptionGrade.deleteMany({
        where: {
          demandeInscriptionId: demandeId,
        },
      });

      // Create new grade associations
      await tx.demandeInscriptionGrade.createMany({
        data: gradeIds.map((gradeId) => {
          const grade = grades.find(
            (g: { id: string; price: number }) => g.id === gradeId,
          );
          return {
            demandeInscriptionId: demandeId,
            gradeId,
            gradePrice: grade?.price || 0,
          };
        }),
      });

      // Update total price
      await tx.demandeInscription.update({
        where: { id: demandeId },
        data: {
          totalPrice,
          updatedAt: new Date(),
        },
      });

      // No update to user.grades here
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating demande grades:", error);
    return {
      success: false,
      error: "Une erreur s'est produite lors de la mise à jour",
    };
  }
}
