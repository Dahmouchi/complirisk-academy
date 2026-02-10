"use server";

import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createNewDemande(userId: string, gradeIds: string[]) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Verify the user ID matches the session
    if (userId !== session.user.id) {
      return { success: false, error: "Non autorisé" };
    }

    // Check if user already has a pending demande
    const existingPendingDemande = await prisma.demandeInscription.findFirst({
      where: {
        userId: userId,
        status: "PENDING",
      },
    });

    if (existingPendingDemande) {
      return {
        success: false,
        error:
          "Vous avez déjà une demande en attente. Veuillez modifier votre demande existante.",
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

    if (grades.length !== gradeIds.length) {
      return {
        success: false,
        error: "Certains grades sélectionnés sont invalides",
      };
    }

    const totalPrice = grades.reduce(
      (sum: number, grade: { price: number }) => sum + grade.price,
      0,
    );

    // Create the demande in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Create the demande
      const newDemande = await tx.demandeInscription.create({
        data: {
          userId: userId,
          totalPrice: totalPrice,
          status: "PENDING",
          grades: {
            create: gradeIds.map((gradeId) => {
              const grade = grades.find(
                (g: { id: string; price: number }) => g.id === gradeId,
              );
              return {
                gradeId,
                gradePrice: grade?.price || 0,
              };
            }),
          },
        },
      });

      // Update user step if needed (optional, keeping it simple for now as it's a new demande for an existing user)
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating new demande:", error);
    return {
      success: false,
      error: "Une erreur s'est produite lors de la création de la demande",
    };
  }
}
