"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateFormateurInput {
  fullName: string;
  bio?: string;
  specialite: string;
  image?: string;
}

interface UpdateFormateurInput {
  id: string;
  fullName: string;
  bio?: string;
  specialite: string;
  image?: string;
}

// Create a new formateur
export async function createFormateur(data: CreateFormateurInput) {
  try {
    const formateur = await prisma.formateur.create({
      data: {
        fullName: data.fullName,
        bio: data.bio,
        specialite: data.specialite,
        image: data.image,
      },
    });

    revalidatePath("/admin/dashboard/teacher");

    return {
      success: true,
      formateur,
    };
  } catch (error) {
    console.error("Error creating formateur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du formateur",
    };
  }
}

// Get all formateurs
export async function getFormateurs() {
  try {
    const formateurs = await prisma.formateur.findMany({
      include: {
        grades: {
          include: {
            niveau: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return formateurs;
  } catch (error) {
    console.error("Error fetching formateurs:", error);
    return [];
  }
}

// Get a single formateur by ID
export async function getFormateurById(id: string) {
  try {
    const formateur = await prisma.formateur.findUnique({
      where: { id },
      include: {
        grades: {
          include: {
            niveau: true,
          },
        },
      },
    });

    return formateur;
  } catch (error) {
    console.error("Error fetching formateur:", error);
    return null;
  }
}

// Update a formateur
export async function updateFormateur(data: UpdateFormateurInput) {
  try {
    const formateur = await prisma.formateur.update({
      where: { id: data.id },
      data: {
        fullName: data.fullName,
        bio: data.bio,
        specialite: data.specialite,
        image: data.image,
      },
    });

    revalidatePath("/admin/dashboard/teacher");

    return {
      success: true,
      formateur,
    };
  } catch (error) {
    console.error("Error updating formateur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du formateur",
    };
  }
}

// Delete a formateur
export async function deleteFormateur(id: string) {
  try {
    await prisma.formateur.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/teacher");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting formateur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression du formateur",
    };
  }
}
