"use server";

import prisma from "@/lib/prisma";

export async function getQuizzesGroupedByMatiere(userId: string) {
  const userWithQuizzes = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      grades: {
        include: {
          subjects: {
            include: {
              courses: {
                include: {
                  quizzes: {
                    include: {
                      questions: {
                        include: {
                          options: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithQuizzes) {
    return { data: [], message: "User not found" };
  }

  // Group quizzes by subject (matière)
  const grouped =
    userWithQuizzes.grades?.[0]?.subjects.map((subject) => ({
      matiereId: subject.id,
      matiereName: subject.name,
      quizzes: subject.courses.flatMap((course) => course.quizzes),
    })) || [];

  return { data: grouped };
}

export async function getQuizzesGroupedByMatiereandUser(
  userId: string,
  subjectId: string,
) {
  const userWithQuizzes = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      grades: {
        include: {
          subjects: {
            where: { handler: subjectId }, // ✅ Filter by subjectId
            include: {
              courses: {
                include: {
                  quizzes: {
                    include: {
                      questions: {
                        include: {
                          options: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithQuizzes) {
    return { data: [], message: "User not found" };
  }

  // Group quizzes by subject (matière)
  const grouped =
    userWithQuizzes.grades?.[0]?.subjects.map((subject) => ({
      matiereId: subject.id,
      matiereName: subject.name,
      quizzes: subject.courses.flatMap((course) => course.quizzes),
    })) || [];

  return { data: grouped };
}

export const saveQuizResult = async (data: {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}) => {
  const existing = await prisma.quizResult.findFirst({
    where: { quizId: data.quizId, userId: data.userId },
    orderBy: { completedAt: "desc" },
  });

  const attempts = existing ? existing.attempts + 1 : 1;

  const result = await prisma.quizResult.create({
    data: {
      ...data,
      attempts,
    },
  });

  await prisma.userActivity.create({
    data: {
      userId: data.userId,
      type: "COMPLETE_QUIZ",
      description: "Quiz terminé",
    },
  });

  return result;
};
export async function getQuizScores(userId: string, quizId?: string) {
  const whereClause = {
    userId,
    ...(quizId && { quizId }),
  };

  const results = await prisma.quizResult.findMany({
    where: whereClause,
    orderBy: {
      completedAt: "desc",
    },
  });

  return results.map((result) => ({
    quizId: result.quizId,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    completedAt: result.completedAt,
    attempts: 0, // This will be calculated in the component
  }));
}
export const getUserQuizResults = async (userId: string) => {
  return await prisma.quizResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });
};

//------------------------------------------------

interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
  questionId?: string;
}

interface Question {
  id?: string;
  content: string;
  answer: string;
  quizId?: string;
  options: Option[];
}

interface Quiz {
  id?: string;
  title: string;
  courseId: string;
  questions: Question[];
}

interface QuizCreateData {
  title: string;
  courseId: string;
  questions: {
    content: string;
    answer: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface QuizUpdateData {
  title?: string;
  questions?: {
    id?: string; // Si présent, mise à jour; sinon, création
    content: string;
    answer: string;
    options: {
      id?: string; // Si présent, mise à jour; sinon, création
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface QuizResult {
  success: boolean;
  data?: any;
  error?: string;
  details?: string[];
}

// Fonction pour valider les données d'un quiz
function validateQuizData(data: QuizCreateData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validation du titre
  if (!data.title || !data.title.trim()) {
    errors.push("Le titre du quiz est requis");
  }

  // Validation du courseId
  if (!data.courseId || !data.courseId.trim()) {
    errors.push("L'ID du cours est requis");
  }

  // Validation des questions
  if (!data.questions || data.questions.length === 0) {
    errors.push("Au moins une question est requise");
  } else {
    data.questions.forEach((question, qIndex) => {
      // Validation du contenu de la question
      if (!question.content || !question.content.trim()) {
        errors.push(`La question ${qIndex + 1} doit avoir un contenu`);
      }

      // Validation de la réponse
      if (!question.answer || !question.answer.trim()) {
        errors.push(`La question ${qIndex + 1} doit avoir une réponse`);
      }

      // Validation des options
      if (!question.options || question.options.length < 2) {
        errors.push(`La question ${qIndex + 1} doit avoir au moins 2 options`);
      } else {
        const correctOptions = question.options.filter((opt) => opt.isCorrect);
        if (correctOptions.length === 0) {
          errors.push(
            `La question ${qIndex + 1} doit avoir au moins une option correcte`,
          );
        }

        question.options.forEach((option, oIndex) => {
          if (!option.text || !option.text.trim()) {
            errors.push(
              `L'option ${oIndex + 1} de la question ${
                qIndex + 1
              } doit avoir un texte`,
            );
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

// Fonction pour vérifier qu'un cours existe
async function validateCourseExists(courseId: string): Promise<boolean> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    return !!course;
  } catch (error) {
    console.error("Erreur lors de la validation du cours:", error);
    return false;
  }
}

// Fonction principale pour créer un quiz complet
export async function createQuiz(data: QuizCreateData): Promise<QuizResult> {
  try {
    // 1. Validation des données d'entrée
    const validation = validateQuizData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: "Données invalides",
        details: validation.errors,
      };
    }

    // 2. Vérifier que le cours existe
    const courseExists = await validateCourseExists(data.courseId);
    if (!courseExists) {
      return {
        success: false,
        error: "Le cours spécifié n'existe pas",
      };
    }

    // 3. Créer le quiz avec ses questions et options en transaction
    const quiz = await prisma.$transaction(async (tx) => {
      // Créer le quiz
      const createdQuiz = await tx.quiz.create({
        data: {
          title: data.title.trim(),
          courseId: data.courseId,
        },
      });

      // Créer les questions avec leurs options
      for (const questionData of data.questions) {
        const createdQuestion = await tx.question.create({
          data: {
            content: questionData.content.trim(),
            answer: questionData.answer.trim(),
            quizId: createdQuiz.id,
          },
        });

        // Créer les options pour cette question
        await tx.option.createMany({
          data: questionData.options.map((option) => ({
            text: option.text.trim(),
            isCorrect: option.isCorrect,
            questionId: createdQuestion.id,
          })),
        });
      }

      // Récupérer le quiz complet avec toutes ses relations
      return await tx.quiz.findUnique({
        where: { id: createdQuiz.id },
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: { id: "asc" },
          },
        },
      });
    });

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error("Erreur lors de la création du quiz:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return {
          success: false,
          error: "Le cours spécifié n'existe pas",
        };
      }
    }

    return {
      success: false,
      error: "Erreur interne du serveur lors de la création du quiz",
    };
  }
}

// Fonction pour récupérer un quiz complet par ID
export async function getQuizById(quizId: string): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { id: "asc" },
            },
          },
          orderBy: { id: "asc" },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Quiz non trouvé",
      };
    }

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la récupération du quiz",
    };
  }
}

// Fonction pour récupérer tous les quiz d'un cours
export async function getQuizzesByCourse(
  courseId: string,
): Promise<QuizResult> {
  try {
    if (!courseId || !courseId.trim()) {
      return {
        success: false,
        error: "L'ID du cours est requis",
      };
    }

    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return {
      success: true,
      data: quizzes,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la récupération des quiz",
    };
  }
}

// Fonction pour mettre à jour un quiz
export async function updateQuiz(
  quizId: string,
  data: QuizUpdateData,
): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    // Vérifier que le quiz existe
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return {
        success: false,
        error: "Quiz non trouvé",
      };
    }

    // Mettre à jour le quiz en transaction
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // Mettre à jour le titre si fourni
      if (data.title) {
        await tx.quiz.update({
          where: { id: quizId },
          data: { title: data.title.trim() },
        });
      }

      // Mettre à jour les questions si fournies
      if (data.questions) {
        // Récupérer les IDs des questions existantes
        const existingQuestionIds = existingQuiz.questions.map((q) => q.id);
        const updatedQuestionIds = data.questions
          .filter((q) => q.id)
          .map((q) => q.id!);

        // Supprimer les questions qui ne sont plus dans la liste
        const questionsToDelete = existingQuestionIds.filter(
          (id) => !updatedQuestionIds.includes(id),
        );
        if (questionsToDelete.length > 0) {
          await tx.question.deleteMany({
            where: {
              id: { in: questionsToDelete },
            },
          });
        }

        // Traiter chaque question
        for (const questionData of data.questions) {
          if (questionData.id) {
            // Mettre à jour une question existante
            await tx.question.update({
              where: { id: questionData.id },
              data: {
                content: questionData.content.trim(),
                answer: questionData.answer.trim(),
              },
            });

            // Gérer les options de cette question
            const existingQuestion = existingQuiz.questions.find(
              (q) => q.id === questionData.id,
            );
            if (existingQuestion) {
              const existingOptionIds = existingQuestion.options.map(
                (o) => o.id,
              );
              const updatedOptionIds = questionData.options
                .filter((o) => o.id)
                .map((o) => o.id!);

              // Supprimer les options qui ne sont plus dans la liste
              const optionsToDelete = existingOptionIds.filter(
                (id) => !updatedOptionIds.includes(id),
              );
              if (optionsToDelete.length > 0) {
                await tx.option.deleteMany({
                  where: {
                    id: { in: optionsToDelete },
                  },
                });
              }

              // Traiter chaque option
              for (const optionData of questionData.options) {
                if (optionData.id) {
                  // Mettre à jour une option existante
                  await tx.option.update({
                    where: { id: optionData.id },
                    data: {
                      text: optionData.text.trim(),
                      isCorrect: optionData.isCorrect,
                    },
                  });
                } else {
                  // Créer une nouvelle option
                  await tx.option.create({
                    data: {
                      text: optionData.text.trim(),
                      isCorrect: optionData.isCorrect,
                      questionId: questionData.id,
                    },
                  });
                }
              }
            }
          } else {
            // Créer une nouvelle question
            const createdQuestion = await tx.question.create({
              data: {
                content: questionData.content.trim(),
                answer: questionData.answer.trim(),
                quizId: quizId,
              },
            });

            // Créer les options pour cette nouvelle question
            await tx.option.createMany({
              data: questionData.options.map((option) => ({
                text: option.text.trim(),
                isCorrect: option.isCorrect,
                questionId: createdQuestion.id,
              })),
            });
          }
        }
      }

      // Récupérer le quiz mis à jour
      return await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            include: {
              options: {
                orderBy: { id: "asc" },
              },
            },
            orderBy: { id: "asc" },
          },
        },
      });
    });

    return {
      success: true,
      data: updatedQuiz,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la mise à jour du quiz",
    };
  }
}

// Fonction pour supprimer un quiz
export async function deleteQuiz(quizId: string): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    // Vérifier que le quiz existe
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return {
        success: false,
        error: "Quiz non trouvé",
      };
    }

    // Supprimer le quiz (cascade supprimera automatiquement les questions et options)
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    return {
      success: true,
      data: {
        message: `Quiz "${existingQuiz.title}" supprimé avec succès`,
        deletedQuestions: existingQuiz._count.questions,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la suppression du quiz",
    };
  }
}

// Fonction pour dupliquer un quiz
export async function duplicateQuiz(
  quizId: string,
  newTitle?: string,
): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    // Récupérer le quiz original
    const originalQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!originalQuiz) {
      return {
        success: false,
        error: "Quiz original non trouvé",
      };
    }

    // Créer la copie
    const duplicatedQuiz = await prisma.$transaction(async (tx) => {
      // Créer le nouveau quiz
      const createdQuiz = await tx.quiz.create({
        data: {
          title: newTitle || `${originalQuiz.title} (Copie)`,
          courseId: originalQuiz.courseId,
        },
      });

      // Dupliquer les questions et options
      for (const question of originalQuiz.questions) {
        const createdQuestion = await tx.question.create({
          data: {
            content: question.content,
            answer: question.answer,
            quizId: createdQuiz.id,
          },
        });

        // Dupliquer les options
        await tx.option.createMany({
          data: question.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            questionId: createdQuestion.id,
          })),
        });
      }

      // Récupérer le quiz dupliqué complet
      return await tx.quiz.findUnique({
        where: { id: createdQuiz.id },
        include: {
          questions: {
            include: {
              options: {
                orderBy: { id: "asc" },
              },
            },
            orderBy: { id: "asc" },
          },
        },
      });
    });

    return {
      success: true,
      data: duplicatedQuiz,
    };
  } catch (error) {
    console.error("Erreur lors de la duplication du quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la duplication du quiz",
    };
  }
}

// Fonction pour obtenir les statistiques d'un quiz
export async function getQuizStats(quizId: string): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        _count: {
          select: {
            questions: true,
            quizResult: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Quiz non trouvé",
      };
    }

    // Calculer les statistiques
    const stats = {
      totalQuestions: quiz._count.questions,
      totalOptions: quiz.questions.reduce(
        (sum, q) => sum + q.options.length,
        0,
      ),
      averageOptionsPerQuestion:
        quiz.questions.length > 0
          ? (
              quiz.questions.reduce((sum, q) => sum + q.options.length, 0) /
              quiz.questions.length
            ).toFixed(1)
          : 0,
      totalAttempts: quiz._count.quizResult,
      questionsWithMultipleCorrectAnswers: quiz.questions.filter(
        (q) => q.options.filter((o) => o.isCorrect).length > 1,
      ).length,
    };

    return {
      success: true,
      data: {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          courseId: quiz.courseId,
        },
        stats,
      },
    };
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors du calcul des statistiques",
    };
  }
}

// Fonction pour supprimer tous les quiz d'un cours
export async function deleteAllCourseQuizzes(
  courseId: string,
): Promise<QuizResult> {
  try {
    if (!courseId || !courseId.trim()) {
      return {
        success: false,
        error: "L'ID du cours est requis",
      };
    }

    // Compter les quiz avant suppression
    const quizCount = await prisma.quiz.count({
      where: { courseId },
    });

    if (quizCount === 0) {
      return {
        success: true,
        data: { message: "Aucun quiz à supprimer" },
      };
    }

    // Supprimer tous les quiz du cours
    const deleteResult = await prisma.quiz.deleteMany({
      where: { courseId },
    });

    return {
      success: true,
      data: {
        message: `${deleteResult.count} quiz supprimé(s) avec succès`,
        deletedCount: deleteResult.count,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la suppression des quiz:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la suppression des quiz",
    };
  }
}

// Fonction pour valider les réponses d'un quiz (pour les résultats)
export async function validateQuizAnswers(
  quizId: string,
  answers: { questionId: string; selectedOptionIds: string[] }[],
): Promise<QuizResult> {
  try {
    if (!quizId || !quizId.trim()) {
      return {
        success: false,
        error: "L'ID du quiz est requis",
      };
    }

    if (!answers || answers.length === 0) {
      return {
        success: false,
        error: "Les réponses sont requises",
      };
    }

    // Récupérer le quiz avec toutes ses questions et options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Quiz non trouvé",
      };
    }

    // Valider les réponses
    const results = answers.map((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);

      if (!question) {
        return {
          questionId: answer.questionId,
          isCorrect: false,
          error: "Question non trouvée",
        };
      }

      const correctOptions = question.options.filter((o) => o.isCorrect);
      const correctOptionIds = correctOptions.map((o) => o.id);

      // Vérifier si les réponses sélectionnées correspondent aux bonnes réponses
      const isCorrect =
        answer.selectedOptionIds.length === correctOptionIds.length &&
        answer.selectedOptionIds.every((id) => correctOptionIds.includes(id)) &&
        correctOptionIds.every((id) => answer.selectedOptionIds.includes(id));

      return {
        questionId: answer.questionId,
        question: question.content,
        selectedOptionIds: answer.selectedOptionIds,
        correctOptionIds,
        isCorrect,
        explanation: question.answer,
      };
    });

    const totalQuestions = results.length;
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      success: true,
      data: {
        quizId,
        totalQuestions,
        correctAnswers,
        score: Math.round(score * 100) / 100, // Arrondir à 2 décimales
        results,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la validation des réponses:", error);
    return {
      success: false,
      error: "Erreur interne du serveur lors de la validation des réponses",
    };
  }
}
