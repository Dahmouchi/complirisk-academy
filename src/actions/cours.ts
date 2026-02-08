"use server";

import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import prisma from "@/lib/prisma";
import sharp from "sharp";

// Types pour les données du formulaire
interface QuizQuestion {
  content: string;
  options: Option[];
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

interface CourseData {
  title: string;
  content: string;
  description: string;
  videoUrl?: string;
  handler: string;
  isFree: boolean;
  index: number;
  subjectId: string;
  coverImage: File | null;
  documents?: File[];
  quizzes?: Quiz[];
}
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// Fonction d'upload d'image existante (fournie par l'utilisateur)
export async function uploadImage(imageURL: File): Promise<string> {
  const image = imageURL;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const ext = image.name.split(".").pop()?.toLowerCase() || "png";
  const filename = `${timestamp}.${ext}`;

  const arrayBuffer = await image.arrayBuffer();
  const sharpInstance = sharp(arrayBuffer).resize(1200);

  // If PNG -> keep PNG
  // If JPG/JPEG -> keep JPEG
  let compressedBuffer;
  if (ext === "png") {
    compressedBuffer = await sharpInstance.png({ quality: 90 }).toBuffer();
  } else {
    compressedBuffer = await sharpInstance.jpeg({ quality: 80 }).toBuffer();
  }

  const fileContent = Buffer.from(compressedBuffer);

  await uploadFile(fileContent, filename, image.type);
  return getFileUrl(filename);
}

// Fonction d'upload de document PDF (adaptée de la fonction image)
export async function uploadDocument(document: File): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${document.name}`;

  const arrayBuffer = await document.arrayBuffer();
  const fileContent = Buffer.from(arrayBuffer);

  // Upload du PDF sans compression (contrairement aux images)
  await uploadFile(fileContent, filename, document.type);

  return getFileUrl(filename);
}

// Fonction helper pour valider les données d'entrée
function validateCourseData(data: CourseData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Le titre du cours est requis");
  }

  if (!data.subjectId?.trim()) {
    errors.push("L'ID de la matière est requis");
  }

  if (typeof data.index !== "number" || data.index < 1) {
    errors.push("L'index du cours doit être un nombre positif");
  }

  // Validation de l'URL vidéo si fournie
  if (data.videoUrl && data.videoUrl.trim()) {
    try {
      new URL(data.videoUrl);
    } catch {
      errors.push("L'URL de la vidéo n'est pas valide");
    }
  }

  // Validation des quiz

  // Validation des quiz
  if (data.quizzes && data.quizzes.length > 0) {
    data.quizzes.forEach((quiz, quizIndex) => {
      if (!quiz.title?.trim()) {
        errors.push(`Le titre du quiz ${quizIndex + 1} est requis`);
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        errors.push(
          `Le quiz ${quizIndex + 1} doit contenir au moins une question`,
        );
      } else {
        quiz.questions.forEach((question, questionIndex) => {
          if (!question.content?.trim()) {
            errors.push(
              `La question ${questionIndex + 1} du quiz ${
                quizIndex + 1
              } est requise`,
            );
          }

          // Validate options instead of single answer
          if (!question.options || question.options.length < 2) {
            errors.push(
              `La question ${questionIndex + 1} doit avoir au moins 2 options`,
            );
          } else {
            const correctOptions = question.options.filter(
              (opt) => opt.isCorrect,
            );
            if (correctOptions.length !== 1) {
              errors.push(
                `La question ${
                  questionIndex + 1
                } doit avoir exactement une option correcte`,
              );
            }

            question.options.forEach((option, optionIndex) => {
              if (!option.text?.trim()) {
                errors.push(
                  `L'option ${optionIndex + 1} de la question ${
                    questionIndex + 1
                  } est requise`,
                );
              }
            });
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Fonction helper pour vérifier l'unicité du handler
async function checkHandlerUniqueness(
  handler: string,
  excludeId?: string,
): Promise<boolean> {
  const existingCourse = await prisma.course.findUnique({
    where: { handler },
    select: { id: true },
  });

  // Si aucun cours trouvé, le handler est unique
  if (!existingCourse) {
    return true;
  }

  // Si on exclut un ID (pour les mises à jour), vérifier que ce n'est pas le même cours
  if (excludeId && existingCourse.id === excludeId) {
    return true;
  }

  return false;
}

// Fonction helper pour vérifier que la matière existe
async function validateSubject(subjectId: string): Promise<boolean> {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  });

  return !!subject;
}

// Fonction principale pour créer un cours
export async function createCourse(data: CourseData) {
  try {
    // 1. Validation des données
    const validation = validateCourseData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: "Données invalides",
        details: validation.errors,
      };
    }

    // 2. Vérif unicité du handler
    const isHandlerUnique = await checkHandlerUniqueness(data.handler);
    if (!isHandlerUnique) {
      return {
        success: false,
        error: "L'identifiant (handler) du cours existe déjà",
      };
    }

    // 3. Vérif matière
    const isSubjectValid = await validateSubject(data.subjectId);
    if (!isSubjectValid) {
      return { success: false, error: "La matière spécifiée n'existe pas" };
    }

    // 4. Upload cover
    let coverImageUrl: string | null = null;
    if (data.coverImage) {
      coverImageUrl = await uploadImage(data.coverImage);
    }

    // 5. Upload documents
    const documentUrls: { name: string; url: string }[] = [];
    if (data.documents?.length) {
      for (const doc of data.documents) {
        const documentUrl = await uploadDocument(doc);
        documentUrls.push({ name: doc.name, url: documentUrl });
      }
    }

    // 6. Créer le cours principal
    const newCourse = await prisma.course.create({
      data: {
        title: data.title,
        content: data.description,
        videoUrl: data.videoUrl || null,
        coverImage: coverImageUrl,
        handler: data.handler,
        isFree: data.isFree,
        index: data.index,
        subjectId: data.subjectId,
      },
    });

    // 7. Créer les documents (en dehors de transaction)
    if (documentUrls.length > 0) {
      await prisma.document.createMany({
        data: documentUrls.map((doc) => ({
          name: doc.name,
          url: doc.url,
          courseId: newCourse.id,
        })),
      });
    }

    // 8. Créer les quiz, questions et options
    if (data.quizzes?.length) {
      for (const quizData of data.quizzes) {
        const quiz = await prisma.quiz.create({
          data: { title: quizData.title, courseId: newCourse.id },
        });

        if (quizData.questions?.length) {
          for (const questionData of quizData.questions) {
            const question = await prisma.question.create({
              data: {
                content: questionData.content,
                quizId: quiz.id,
                answer:
                  questionData.options.find((opt) => opt.isCorrect)?.text || "",
              },
            });

            // Créer les options sans transaction (plus rapide)
            if (questionData.options?.length) {
              await prisma.option.createMany({
                data: questionData.options.map((opt) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  questionId: question.id,
                })),
              });
            }
          }
        }
      }
    }

    // 9. Retourner le cours complet
    const cours = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: {
        subject: { include: { grade: true } },
        documents: true,
        quizzes: { include: { questions: true } },
      },
    });

    return { success: true, data: cours, message: "Cours créé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la création du cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la création du cours",
    };
  }
}

// Fonction helper pour mettre à jour un cours existant
export async function updateCourse(
  courseId: string,
  data: Partial<CourseData>,
) {
  try {
    // Vérifier que le cours existe
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, handler: true, coverImage: true },
    });

    if (!existingCourse) {
      return {
        success: false,
        error: "Cours non trouvé",
      };
    }

    // Validation partielle des données
    const errors: string[] = [];

    if (data.title !== undefined && !data.title.trim()) {
      errors.push("Le titre du cours ne peut pas être vide");
    }

    if (data.subjectId !== undefined) {
      const isSubjectValid = await validateSubject(data.subjectId);
      if (!isSubjectValid) {
        errors.push("La matière spécifiée n'existe pas");
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: "Données invalides",
        details: errors,
      };
    }

    // Upload de la nouvelle image de couverture si fournie
    let coverImageUrl: string | undefined;
    if (data.coverImage !== existingCourse.coverImage && data.coverImage) {
      try {
        coverImageUrl = await uploadImage(data.coverImage);
      } catch (error) {
        console.error(
          "Erreur lors de l'upload de l'image de couverture:",
          error,
        );
        return {
          success: false,
          error: "Erreur lors de l'upload de l'image de couverture",
        };
      }
    }

    // Mise à jour du cours
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.isFree !== undefined && { isFree: data.isFree }),
        ...(data.index !== undefined && { index: data.index }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl || null }),
        ...(coverImageUrl && { coverImage: coverImageUrl }),
        ...(data.subjectId !== undefined && { subjectId: data.subjectId }),
      },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedCourse,
      message: "Cours mis à jour avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la mise à jour du cours",
    };
  }
}
// Example in /actions/cours.ts
export async function updateCourseDocuments(
  courseId: string,
  docs: { name: string; url: string; courseId: string; id?: string }[],
) {
  try {
    // Get current documents from DB
    const existingDocs = await prisma.document.findMany({
      where: { courseId },
    });

    // Find docs to delete (in DB but not in the new list)
    const toDelete = existingDocs.filter(
      (dbDoc) => !docs.some((d) => d.id === dbDoc.id),
    );

    // Delete removed docs
    await prisma.document.deleteMany({
      where: { id: { in: toDelete.map((d) => d.id) } },
    });

    // Upsert all docs (update if id exists, create otherwise)
    for (const doc of docs) {
      if (doc.id) {
        await prisma.document.update({
          where: { id: doc.id },
          data: { name: doc.name, url: doc.url },
        });
      } else {
        await prisma.document.create({
          data: { name: doc.name, url: doc.url, courseId },
        });
      }
    }

    // Return updated course
    const updatedCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { documents: true },
    });

    return { success: true, updatedCourse };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update documents" };
  }
}

// Fonction helper pour supprimer un cours
export async function deleteCourse(courseId: string) {
  try {
    // Vérifier que le cours existe
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!existingCourse) {
      return {
        success: false,
        error: "Cours non trouvé",
      };
    }

    // Suppression en cascade (les documents, quiz et questions seront supprimés automatiquement
    // si vous avez configuré les relations avec onDelete: Cascade dans votre schéma Prisma)
    await prisma.course.delete({
      where: { id: courseId },
    });

    return {
      success: true,
      message: "Cours supprimé avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la suppression du cours",
    };
  }
}

// Fonction helper pour récupérer un cours avec toutes ses relations
export async function getCourseById(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
        documents: true,
        quizzes: {
          include: {
            questions: true,
          },
        },
        progress: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return {
        success: false,
        error: "Cours non trouvé",
      };
    }

    return {
      success: true,
      data: course,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la récupération du cours",
    };
  }
}

// Fonction helper pour récupérer tous les cours d'une matière
export async function getCoursesBySubject(subjectId: string) {
  try {
    const courses = await prisma.course.findMany({
      where: { subjectId },
      orderBy: { index: "asc" },
      include: {
        documents: true,
        quizzes: {
          include: {
            questions: true,
          },
        },
      },
    });

    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la récupération des cours",
    };
  }
}

export async function getCoursByHandle(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
        documents: true,
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        progress: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return {
        success: false,
        error: "Cours non trouvé",
      };
    }

    return {
      success: true,
      data: course,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du cours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la récupération du cours",
    };
  }
}
export async function getAllDocumentsBySubjectId(subjectId: string) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { handler: subjectId },
      include: {
        courses: {
          include: {
            documents: true, // include all documents of each course in this subject
          },
        },
      },
    });

    if (!subject) {
      return {
        success: false,
        error: "Sujet non trouvé",
      };
    }

    // Flatten all documents into a single array (optional)
    const allDocuments = subject.courses.flatMap((course) => course.documents);

    return {
      success: true,
      data: {
        subject: subject.name,
        documents: allDocuments,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    return {
      success: false,
      error:
        "Erreur interne du serveur lors de la récupération des documents du sujet",
    };
  }
}
