"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";

import { compare } from "bcrypt";
import sendEmail from "@/lib/sendemail";

export async function changeAdminPassword(
  id: string,
  oldPassword: string,
  newPassword: string,
  confirmedPassword: string,
): Promise<string> {
  // Validate that new password matches the confirmation
  if (newPassword !== confirmedPassword) {
    throw new Error("New password and confirmed password do not match.");
  }

  // Validate password strength
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long.");
  }

  // Fetch the user from the database
  const admin = await prisma.user.findUnique({ where: { id } });

  if (!admin || !admin.password) {
    throw new Error("User not found or password is missing.");
  }

  // Verify the old password
  const isMatch = await compare(oldPassword, admin.password); // Ensure `compare` is awaited
  if (!isMatch) {
    throw new Error("Old password does not match.");
  }

  // Hash the new password
  const hashedPassword = await hash(newPassword, 10);

  // Update the password in the database
  try {
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return "Password updated successfully.";
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while updating the password.",
    );
  }
}
export async function updateUser(
  userId: string,
  name: string,
  prenom: string,
  email: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Update the password in the database
    await prisma.user.update({
      where: { username: userId },
      data: { name, prenom, email },
    });

    return "user updated successfully.";
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
export async function RegisterClient(
  nom: string,
  prenom: string,
  email: string,
  phone: string,
  password: string,
) {
  try {
    const hashedPassword = await hash(password, 10);

    const blog = await prisma.user.create({
      data: {
        name: nom,
        username: email,
        prenom: prenom || null,
        email: email || "",
        password: hashedPassword,
        phone: phone,
      },
    });

    revalidatePath("/");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.user.findUnique({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}
export async function updateClientProfile1(
  id: string,
  formData: {
    personal: {
      nom: string;
      prenom: string;
      phone: string;
      fonction: string;
      lieuEtudeTravail: string;
    };
    study: {
      niveau: string;
    };
  },
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: formData.personal.nom,
        prenom: formData.personal.prenom,
        phone: formData.personal.phone,
        fonction: formData.personal.fonction,
        lieuEtudeTravail: formData.personal.lieuEtudeTravail,
        StatutUser: "subscribed",
        step: 1, // Set step = 1 to mark profile as completed
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating client profile:", error);
    return null;
  }
}
/**
 * Create a DemandeInscription (registration request) with selected grades
 */
export async function createDemandeInscription(
  userId: string,
  formData: {
    study: {
      selectedGrades: string[]; // Array of grade IDs
      niveau: string;
    };
  },
) {
  try {
    // First, fetch the grade prices to calculate total
    const grades = await prisma.grade.findMany({
      where: {
        id: {
          in: formData.study.selectedGrades,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    // Calculate total price
    const totalPrice = grades.reduce(
      (sum, grade) => sum + (grade.price || 0),
      0,
    );

    // Create the DemandeInscription
    const demande = await prisma.demandeInscription.create({
      data: {
        userId,
        totalPrice,
        status: "PENDING",
        grades: {
          create: grades.map((grade) => ({
            gradeId: grade.id,
            gradePrice: grade.price || 0,
          })),
        },
      },
      include: {
        grades: {
          include: {
            grade: true,
          },
        },
      },
    });

    // Update user step to mark registration as completed
    await prisma.user.update({
      where: { id: userId },
      data: {
        step: 2,
        StatutUser: "subscribed", // Mark as subscribed but awaiting approval
      },
    });

    // Get user details for email notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        prenom: true,
        email: true,
        phone: true,
      },
    });

    // Send email notification to admin
    const gradeNames = demande.grades.map((dg) => dg.grade.name).join(", ");

    const emailContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Demande d'Inscription</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #5B23FF 0%, #5B23FF 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nouvelle Demande d'Inscription</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Bonjour,</p>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
        Une nouvelle demande d'inscription a été soumise et nécessite votre attention.
      </p>
      
      <!-- User Information -->
      <div style="background-color: #f8fafc; border-left: 4px solid #5B23FF; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #5B23FF; font-size: 18px;">📋 Informations de l'étudiant</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Nom complet:</td>
            <td style="padding: 8px 0; color: #333;">${user?.name || ""} ${user?.prenom || ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #333;">${user?.email || ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Téléphone:</td>
            <td style="padding: 8px 0; color: #333;">${user?.phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Normes demandés:</td>
            <td style="padding: 8px 0; color: #333;">${gradeNames}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Prix total:</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${totalPrice} DH</td>
          </tr>
        </table>
      </div>
      
      <!-- Action Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://complirisk-academy.vercel.app"}/admin/dashboard/demandes" 
           style="display: inline-block; background: linear-gradient(135deg, #5B23FF 0%, #5B23FF 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Voir la demande
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        Veuillez examiner cette demande et prendre les mesures appropriées.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="padding: 24px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px; line-height: 1.5;">
        Ceci est un message automatique. Veuillez ne pas répondre à cet email.
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        © ${new Date().getFullYear()} CompliRisk Academy. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await sendEmail(
        "hassandahmouchi0@gmail.com",
        "Nouvelle Demande d'Inscription - CompliRisk Academy",
        emailContent,
      );
      console.log("Admin notification email sent successfully");
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError);
      // Don't throw error here - demande was created successfully
    }

    // Revalidate paths to update UI
    revalidatePath("/admin/dashboard/demandes");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      demande,
    };
  } catch (error) {
    console.error("Error creating demande inscription:", error);
    throw error;
  }
}

import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
export async function getStudentById() {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      const client = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          activities: {
            orderBy: {
              createdAt: "desc",
            },
          },
          badges: true,
          demandeInscription: {
            include: {
              grades: {
                include: {
                  grade: true,
                },
              },
            },
          },
          grades: {
            include: {
              niveau: true,
              subjects: {
                include: {
                  courses: {
                    include: {
                      progress: true,
                    },
                    orderBy: {
                      createdAt: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!client) return null;
      // Backward compatibility: map the first grade to 'grade'
      return {
        ...client,
        grade: client.grades?.[0] || null,
      };
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

export async function getStudentRegister() {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      const client = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          registerCode: true,
        },
      });
      if (client?.registerCode) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}
export async function UnlockedLive(code: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      const codeRegister = await prisma.registerCode.findUnique({
        where: { code },
      });
      if (!codeRegister) {
        return {
          success: false,
          message: "Code non trouvé",
        };
      } else if (codeRegister.isUsed) {
        return {
          success: false,
          message: "Code déjà utilisé",
        };
      } else {
        const client = await prisma.user.findFirst({
          where: { id: session.user.id },
        });
        await prisma.registerCode.update({
          where: { code: codeRegister.code },
          data: {
            isUsed: true,
            usedAt: new Date(),
            user: {
              connect: { id: client?.id },
            },
          },
        });
        return {
          success: true,
          message: "Code utilisé avec succès",
        };
      }
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }
}
export async function getDashboardUsers() {
  const users = await prisma.user.findMany({
    where: { archive: false, role: "USER" },
    include: {
      grades: {
        include: {
          niveau: true,
        },
      },
    },
  });
  // Backward compatibility: map `grades[0]` to `grade` for each user
  return {
    data: users.map((u) => ({
      ...u,
      grade: u.grades?.[0] || null,
    })),
  };
}
export async function getDashboardUsersArchived() {
  const users = await prisma.user.findMany({
    where: { archive: true },
    include: {
      grades: {
        include: {
          niveau: true,
        },
      },
    },
  });
  // Backward compatibility
  return {
    data: users.map((u) => ({
      ...u,
      grade: u.grades?.[0] || null,
    })),
  };
}

export async function getStudentStats(userId: string) {
  // 1. Cours terminés (from CourseProgress)
  const completedCourses = await prisma.courseProgress.count({
    where: { userId, completed: true },
  });

  // 2. Heures d'étude (estimate from completed courses or logs if you track time)
  // For now, let's say each course = 3 hours
  const studyHours = completedCourses * 3;

  // 4. Streak actuel (track login streak, fallback dummy for now)
  // You can implement based on login dates (last 7 consecutive days)
  const streak = await calculateVerificationDays(userId); // optional function below

  return {
    completedCourses,
    studyHours,
    streak,
  };
}

async function calculateVerificationDays(userId: string): Promise<number> {
  // Get the user with emailVerified date
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  if (!user || !user.emailVerified) {
    return 0; // User not found or email not verified
  }

  // Calculate days since verification
  const verificationDate = new Date(user.emailVerified);
  const currentDate = new Date();

  // Reset time components to compare just dates
  verificationDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const timeDifference = currentDate.getTime() - verificationDate.getTime();
  const daysSinceVerification = Math.floor(
    timeDifference / (1000 * 60 * 60 * 24),
  );

  return daysSinceVerification >= 0 ? daysSinceVerification : 0;
}

export async function TimerStart(userId: string, sessionDuration: number) {
  try {
    // Update user's totalTimeSpent by incrementing with sessionDuration
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalTimeSpent: {
          increment: sessionDuration,
        },
      },
    });

    return { userId: updatedUser.id };
  } catch (error) {
    console.error("Error updating user total time spent:", error);
    throw new Error("Failed to update user total time spent.");
  }
}
export async function archiveUser(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        StatutUser: "awaiting",
        archive: true, // set the archive flag to true
      },
    });

    return {
      success: true,
      message: "User archived successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error archiving user:", error);
    return {
      success: false,
      message: "Failed to archive user",
      error,
    };
  }
}
export async function unarchiveUser(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        archive: false, // set the archive flag to false
      },
    });

    return {
      success: true,
      message: "User unarchived successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error unarchiving user:", error);
    return {
      success: false,
      message: "Failed to unarchive user",
      error,
    };
  }
}

export async function verifyUser(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        StatutUser: "verified",
      },
    });

    return {
      success: true,
      message: "User verified successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return {
      success: false,
      message: "Failed to archive user",
      error,
    };
  }
}

/**
 * Get all available grades with their niveau information
 */
export async function getAllGrades() {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        niveau: true,
      },
      orderBy: [
        {
          niveau: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });
    return grades;
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw new Error("Failed to fetch grades");
  }
}

/**
 * Add a grade to a user
 */
export async function addGradeToUser(userId: string, gradeId: string) {
  try {
    // Check if user already has this grade
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        grades: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Utilisateur non trouvé",
      };
    }

    if (user.grades.some((g) => g.id === gradeId)) {
      return {
        success: false,
        message: "L'utilisateur a déjà ce niveau",
      };
    }

    // Add the grade to the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        grades: {
          connect: { id: gradeId },
        },
      },
    });

    revalidatePath("/admin/dashboard/users");

    return {
      success: true,
      message: "Niveau ajouté avec succès",
    };
  } catch (error) {
    console.error("Error adding grade to user:", error);
    return {
      success: false,
      message: "Erreur lors de l'ajout du niveau",
      error,
    };
  }
}

/**
 * Remove a grade from a user
 */
export async function removeGradeFromUser(userId: string, gradeId: string) {
  try {
    // Check if user has this grade
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        grades: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Utilisateur non trouvé",
      };
    }

    if (!user.grades.some((g) => g.id === gradeId)) {
      return {
        success: false,
        message: "L'utilisateur n'a pas ce niveau",
      };
    }

    // Don't allow removing the last grade
    if (user.grades.length === 1) {
      return {
        success: false,
        message: "L'utilisateur doit avoir au moins un niveau",
      };
    }

    // Remove the grade from the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        grades: {
          disconnect: { id: gradeId },
        },
      },
    });

    revalidatePath("/admin/dashboard/users");

    return {
      success: true,
      message: "Niveau retiré avec succès",
    };
  } catch (error) {
    console.error("Error removing grade from user:", error);
    return {
      success: false,
      message: "Erreur lors du retrait du niveau",
      error,
    };
  }
}
