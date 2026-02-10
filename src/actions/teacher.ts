"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

interface GradeSubjectPair {
  gradeId: string;
  subjectId: string;
}

interface CreateTeacherInput {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  password: string;
  gradeSubjects: GradeSubjectPair[];
}

export async function createTeacher(data: CreateTeacherInput) {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      };
    }
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer l'enseignant avec les relations aux matières
    const teacher = await prisma.user.create({
      data: {
        name: data.nom,
        prenom: data.prenom,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        username: data.email,
        role: "TEACHER",
        statut: true,
        emailVerified: new Date(),
        teacherSubjects: {
          create: data.gradeSubjects.map((gs) => ({
            subjectId: gs.subjectId,
            gradeId: gs.gradeId,
          })),
        },
      },
      include: {
        teacherSubjects: {
          include: {
            subject: true,
            grade: true,
          },
        },
      },
    });

    revalidatePath("/admin/teachers");

    return {
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        prenom: teacher.prenom,
        email: teacher.email,
        subjects: teacher.teacherSubjects.map((ts) => ts.subject),
      },
    };
  } catch (error) {
    console.error("Error creating teacher:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'enseignant",
    };
  }
}

// Fonction pour récupérer tous les enseignants avec leurs matières
export async function getTeachers() {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        archive: false,
      },
      include: {
        teacherSubjects: {
          include: {
            subject: {
              include: {
                grade: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return teachers;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}

// Fonction pour récupérer les matières disponibles
export async function getAvailableSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        grade: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

// Fonction pour récupérer les niveaux scolaires avec leurs matières
export async function getGrades() {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        niveau: true,
        subjects: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return grades;
  } catch (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
}

// Update teacher information
export async function updateTeacherInfo(
  teacherId: string,
  name: string,
  prenom: string,
  email: string,
  phone: string,
) {
  try {
    // Check if the teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: "TEACHER" },
    });

    if (!teacher) {
      return {
        success: false,
        message: "Enseignant non trouvé",
      };
    }

    // Check if email is already used by another user
    if (email !== teacher.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return {
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur",
        };
      }
    }

    // Update teacher information
    await prisma.user.update({
      where: { id: teacherId },
      data: {
        name,
        prenom,
        email,
        phone,
        username: email, // Update username to match email
      },
    });

    revalidatePath("/teacher/dashboard/settings");
    revalidatePath("/teacher/dashboard");

    return {
      success: true,
      message: "Informations mises à jour avec succès",
    };
  } catch (error) {
    console.error("Error updating teacher info:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour",
    };
  }
}
