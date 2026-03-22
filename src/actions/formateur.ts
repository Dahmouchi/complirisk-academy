"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";

interface CreateFormateurInput {
  fullName: string;
  bio?: string;
  specialite: string;
  image?: string;
  // Optional linked user account fields
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  prenom?: string;
  nom?: string;
  fonction?: string;
}

interface UpdateFormateurInput {
  id: string;
  fullName?: string;
  bio?: string;
  specialite: string;
  image?: string;
  // Linked User account fields
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  fonction?: string;
  password?: string;
}

// Create a new formateur (and optionally a linked User account)
export async function createFormateur(data: CreateFormateurInput) {
  try {
    // If account fields are provided, create both atomically
    if (data.username && data.password) {
      // Validate username uniqueness first
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username.toLowerCase() },
      });
      if (existingUser) {
        return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
      }

      const hashedPassword = await hash(data.password, 10);
      const email =
        data.email?.trim() ||
        `${data.username.toLowerCase()}@formateur.complirisk.local`;

      // Check email uniqueness if provided
      if (data.email?.trim()) {
        const existingEmail = await prisma.user.findUnique({
          where: { email: data.email.trim() },
        });
        if (existingEmail) {
          return { success: false, error: "Cet email est déjà utilisé." };
        }
      }

      const [formateur] = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            username: data.username!.toLowerCase(),
            email,
            password: hashedPassword,
            image: data.image,
            name: data.nom,
            prenom: data.prenom,
            phone: data.phone,
            fonction: data.fonction,
            role: "TEACHER",
          },
        });

        const formateur = await tx.formateur.create({
          data: {
            fullName: data.nom + " " + data.prenom,
            bio: data.bio,
            specialite: data.specialite,
            image: data.image,
            userId: user.id,
          },
        });

        return [formateur, user];
      });

      revalidatePath("/admin/dashboard/teacher");
      return { success: true, formateur };
    }

    // No account fields — create formateur only
    const formateur = await prisma.formateur.create({
      data: {
        fullName: data.prenom + " " + data.nom,
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
        user: true,
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
    // Fetch current record to get linked userId
    const existing = await prisma.formateur.findUnique({
      where: { id: data.id },
      include: { user: true },
    });

    if (!existing) {
      return { success: false, error: "Formateur introuvable." };
    }

    // Compute fullName from nom/prenom if provided
    const fullName =
      data.nom !== undefined || data.prenom !== undefined
        ? `${data.nom ?? existing.user?.name ?? ""} ${data.prenom ?? existing.user?.prenom ?? ""}`.trim()
        : (data.fullName ?? existing.fullName);

    // If a new password is provided, hash it
    let hashedPassword: string | undefined;
    if (data.password && data.password.length >= 6) {
      const { hash } = await import("bcrypt");
      hashedPassword = await hash(data.password, 10);
    }

    // Update Formateur row
    const formateur = await prisma.formateur.update({
      where: { id: data.id },
      data: {
        fullName,
        bio: data.bio,
        specialite: data.specialite,
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    // Update linked User if one exists
    if (existing.userId) {
      // Check email uniqueness before updating
      if (data.email && data.email !== existing.user?.email) {
        const taken = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (taken) {
          return {
            success: false,
            error: "Cet email est déjà utilisé par un autre compte.",
          };
        }
      }

      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          ...(data.nom !== undefined && { name: data.nom }),
          ...(data.prenom !== undefined && { prenom: data.prenom }),
          ...(data.email && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.fonction !== undefined && { fonction: data.fonction }),
          ...(hashedPassword && { password: hashedPassword }),
          ...(data.image !== undefined && { image: data.image }),
        },
      });
    }

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

// ──────────────────────────────────────────────────────────────────────────────
// Authentication: create / link a User account to a Formateur
// ──────────────────────────────────────────────────────────────────────────────

interface CreateFormateurAccountInput {
  /** The Formateur record to attach the account to */
  formateurId: string;
  /** Desired username for login (unique) */
  username: string;
  /** Plain-text password — will be hashed before storage */
  password: string;
  /** Optional e-mail for the account */
  email?: string;
}

/**
 * Creates a User with role FORMATEUR and links it to an existing Formateur record.
 * If the Formateur already has a linked user, returns an error.
 */
export async function createFormateurAccount(
  data: CreateFormateurAccountInput,
) {
  try {
    const formateur = await prisma.formateur.findUnique({
      where: { id: data.formateurId },
    });

    if (!formateur) {
      return { success: false, error: "Formateur introuvable." };
    }

    if (formateur.userId) {
      return {
        success: false,
        error: "Ce formateur possède déjà un compte utilisateur.",
      };
    }

    // Check username uniqueness
    const existing = await prisma.user.findUnique({
      where: { username: data.username.toLowerCase() },
    });
    if (existing) {
      return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
    }

    const hashedPassword = await hash(data.password, 10);

    // Build a safe email fallback so the unique constraint never fails
    const email =
      data.email?.trim() ||
      `${data.username.toLowerCase()}@formateur.complirisk.local`;

    const user = await prisma.user.create({
      data: {
        username: data.username.toLowerCase(),
        email,
        password: hashedPassword,
        name: formateur.fullName,
        role: "TEACHER",
        // Link back to the Formateur through the reverse relation
        formateur: { connect: { id: data.formateurId } },
      },
    });

    revalidatePath("/admin/dashboard/formateurs");

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error creating formateur account:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du compte.",
    };
  }
}

/**
 * Fetch a Formateur together with its linked User account info.
 */
export async function getFormateurWithUser(formateurId: string) {
  try {
    const formateur = await prisma.formateur.findUnique({
      where: { id: formateurId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            statut: true,
            createdAt: true,
          },
        },
        grades: { include: { niveau: true } },
      },
    });
    return formateur;
  } catch (error) {
    console.error("Error fetching formateur with user:", error);
    return null;
  }
}
