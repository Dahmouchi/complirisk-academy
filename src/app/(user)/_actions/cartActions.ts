"use server";

import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

/**
 * Get the user's cart with all items and grade details
 */
export async function getCart() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié", cart: null };
    }

    // Find or create cart for the user
    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            grade: {
              include: {
                niveau: true,
                subjects: true,
              },
            },
          },
          orderBy: {
            addedAt: "desc",
          },
        },
      },
    });

    // If no cart exists, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              grade: {
                include: {
                  niveau: true,
                  subjects: true,
                },
              },
            },
          },
        },
      });
    }

    return { success: true, cart };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du panier",
      cart: null,
    };
  }
}

/**
 * Add a grade to the user's cart
 */
export async function addToCart(gradeId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Check if user already owns this grade
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { grades: true },
    });

    if (user?.grades.some((g) => g.id === gradeId)) {
      return { success: false, error: "Vous possédez déjà ce grade" };
    }

    // Check if user has a pending demande
    const pendingDemande = await prisma.demandeInscription.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
    });

    if (pendingDemande) {
      return {
        success: false,
        error: "Vous avez déjà une demande en attente",
      };
    }

    // Get the grade with price
    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      select: { id: true, price: true },
    });

    if (!grade) {
      return { success: false, error: "Grade non trouvé" };
    }

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_gradeId: {
          cartId: cart.id,
          gradeId: gradeId,
        },
      },
    });

    if (existingItem) {
      return { success: false, error: "Déjà dans votre sélection" };
    }

    // Add item to cart
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        gradeId: gradeId,
        priceAtAdd: grade.price,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, message: "Ajouté à votre sélection" };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error: "Erreur lors de l'ajout au panier",
    };
  }
}

/**
 * Remove a grade from the user's cart
 */
export async function removeFromCart(gradeId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return { success: false, error: "Panier non trouvé" };
    }

    // Delete the cart item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        gradeId: gradeId,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, message: "Retiré de votre sélection" };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression du panier",
    };
  }
}

/**
 * Clear all items from the user's cart
 */
export async function clearCart() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return { success: true }; // No cart to clear
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, message: "Panier vidé" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error: "Erreur lors du vidage du panier",
    };
  }
}

/**
 * Create a demande from the cart items
 */
export async function createDemandeFromCart() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Check if user already has a pending demande
    const existingPendingDemande = await prisma.demandeInscription.findFirst({
      where: {
        userId: session.user.id,
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

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            grade: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        error: "Votre panier est vide",
      };
    }

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd,
      0,
    );

    // Create the demande in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Create the demande
      await tx.demandeInscription.create({
        data: {
          userId: session.user.id,
          totalPrice: totalPrice,
          status: "PENDING",
          grades: {
            create: cart.items.map((item) => ({
              gradeId: item.gradeId,
              gradePrice: item.priceAtAdd,
            })),
          },
        },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");
    return { success: true, message: "Demande créée avec succès" };
  } catch (error) {
    console.error("Error creating demande from cart:", error);
    return {
      success: false,
      error: "Une erreur s'est produite lors de la création de la demande",
    };
  }
}

/**
 * Get cart item count
 */
export async function getCartCount() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, count: 0 };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return { success: true, count: cart?._count.items || 0 };
  } catch (error) {
    console.error("Error getting cart count:", error);
    return { success: false, count: 0 };
  }
}
