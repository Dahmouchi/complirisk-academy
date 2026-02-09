"use server";
// app/api/student/dashboard/route.ts (or your server-side structure)
import { NextRequest, NextResponse } from "next/server";
import { ActivityType, Prisma, PrismaClient } from "@prisma/client";

// Define validation schema
const updateUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le téléphone doit contenir au moins 10 chiffres"),
  location: z
    .string()
    .min(2, "La localisation doit contenir au moins 2 caractères"),
});

type UpdateResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateUserInfo(
  userId: string,
  formData: {
    name: string;
    prenom: string;
    phone: string;
    location: string;
  },
): Promise<UpdateResult> {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    const clerkUserId = session?.user.id;

    if (!clerkUserId) {
      return {
        success: false,
        message: "Non autorisé",
      };
    }

    // Validate that the userId matches the authenticated user
    if (userId !== clerkUserId) {
      return {
        success: false,
        message: "Non autorisé",
      };
    }

    // Validate the data
    const validatedData = updateUserSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Erreur de validation",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, prenom, phone, location } = validatedData.data;

    // Update user in database
    await prisma.user.update({
      where: { id: clerkUserId },
      data: {
        name,
        prenom,
        phone,
        verified_email: location,
      },
    });
    await prisma.userActivity.create({
      data: {
        userId,
        type: "UPDATE_PROFILE",
        description: "Profil mis à jour",
      },
    });
    // Revalidate the profile page to show updated data
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profil mis à jour avec succès!",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
}
export async function updateStudentPicture(file: any, userId: string) {
  try {
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        image: imageUrl,
      },
    });
    await prisma.userActivity.create({
      data: {
        userId,
        type: "UPDATE_PROFILE",
        description: "Photo de profil mise à jour",
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating student picture:", error);
    return NextResponse.json(
      { error: "Failed to update student picture" },
      { status: 500 },
    );
  }
}
export async function getNotesGlobal(userId: string) {
  try {
    const notesGlobal = await prisma.notesGlobal.findMany({
      where: { userId },
    });
    return notesGlobal;
  } catch (error) {
    console.error("Error fetching notes global:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes global" },
      { status: 500 },
    );
  }
}
export async function addNotesGlobal(userId: string, note: any) {
  try {
    const newNote = await prisma.notesGlobal.create({
      data: {
        ...note,
        userId,
      },
    });

    return newNote;
  } catch (error) {
    console.error("Error adding notes global:", error);
    return NextResponse.json(
      { error: "Failed to add notes global" },
      { status: 500 },
    );
  }
}
export async function updateNotesGlobal(noteId: string, note: any) {
  try {
    const updatedNote = await prisma.notesGlobal.update({
      where: { id: noteId },
      data: note,
    });
    return updatedNote;
  } catch (error) {
    console.error("Error updating notes global:", error);
    return NextResponse.json(
      { error: "Failed to update notes global" },
      { status: 500 },
    );
  }
}
export async function deleteNotesGlobal(noteId: string) {
  try {
    const deletedNote = await prisma.notesGlobal.delete({
      where: { id: noteId },
    });
    return deletedNote;
  } catch (error) {
    console.error("Error deleting notes global:", error);
    return NextResponse.json(
      { error: "Failed to delete notes global" },
      { status: 500 },
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const dashboardStats = await getStudentDashboardStats(userId);

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}

// Main function to get all dashboard statistics
export async function getStudentDashboardStats(userId: string) {
  try {
    const [totalStudyTime, averageScore, completedCourses, totalCourses] =
      await Promise.all([
        getTotalStudyTime(userId),
        getAverageQuizScore(userId),
        getCompletedCoursesCount(userId),
        getTotalCoursesCount(userId),
      ]);

    return {
      totalStudyTime,
      averageScore,
      completedCourses,
      totalCourses,
    };
  } catch (error) {
    console.error("Error in getStudentDashboardStats:", error);
    throw error;
  }
}
export async function updateLoginStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      streak: true,
      lastLoginDate: true,
    },
  });

  const now = new Date();

  // Normalize dates (midnight)
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let newStreak = 1;

  if (user?.lastLoginDate) {
    const lastLogin = new Date(user.lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);

    const diffDays =
      (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      // Already logged in today → do nothing
      return;
    }

    if (diffDays === 1) {
      // Consecutive day
      newStreak = user.streak + 1;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      lastLoginDate: now,
    },
  });
}

// 1. Get Current Series (Série en cours)
async function getCurrentSeries(userId: string) {
  try {
    // Get user's grades to find their level/subjects
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        grades: {
          select: {
            niveauId: true,
            subjects: {
              include: {
                courses: {
                  include: {
                    progress: {
                      where: { userId },
                    },
                  },
                  orderBy: { index: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.grades || user.grades.length === 0) return null;

    // Find the first course that's not completed yet
    let currentCourse = null;
    let nextCourse = null;
    let subjectWithProgress = null;

    // Loop through all grades
    for (const grade of user.grades) {
      // Loop through subjects to find the current course
      for (const subject of grade.subjects) {
        for (const course of subject.courses) {
          const userProgress = course.progress.find((p) => p.userId === userId);

          if (!userProgress?.completed) {
            currentCourse = course;
            subjectWithProgress = subject;
            break;
          }
        }
        if (currentCourse) break;
      }
      if (currentCourse) break;
    }

    if (!currentCourse) {
      // All courses are completed, get the last one from the last grade
      const lastGrade = user.grades[user.grades.length - 1];
      const lastSubject = lastGrade.subjects[lastGrade.subjects.length - 1];
      const lastCourse = lastSubject?.courses[lastSubject.courses.length - 1];
      return {
        subject: lastSubject?.name || "Completed",
        course: lastCourse?.title || "All courses completed",
        progress: 100,
        isCompleted: true,
      };
    }

    // Find next course in sequence
    const subjectCourses = subjectWithProgress?.courses || [];
    const currentIndex = subjectCourses.findIndex(
      (c) => c.id === currentCourse.id,
    );
    nextCourse = subjectCourses[currentIndex + 1] || null;

    return {
      subject: subjectWithProgress?.name || "Unknown Subject",
      course: currentCourse.title,
      courseId: currentCourse.id,
      subjectId: subjectWithProgress?.id,
      nextCourse: nextCourse?.title,
      progress: calculateCourseProgress(currentCourse),
      totalCoursesInSubject: subjectCourses.length,
      currentCourseIndex: currentIndex + 1,
      isCompleted: false,
    };
  } catch (error) {
    console.error("Error getting current series:", error);
    return null;
  }
}

// 2. Get Total Study Time (Temps d'étude)
async function getTotalStudyTime(userId: string) {
  try {
    // Get total time spent from user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalTimeSpent: true },
    });

    // Also calculate from quiz results (time spent on quizzes)
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      select: { completedAt: true, attempts: true },
    });

    // Estimate quiz time (average 2 minutes per question per attempt)
    const estimatedQuizTime = quizResults.reduce((total, result) => {
      return total + result.attempts * 2 * 60; // Convert to seconds
    }, 0);

    const totalTime = (user?.totalTimeSpent || 0) + estimatedQuizTime;

    return totalTime; // Returns time in seconds
  } catch (error) {
    console.error("Error getting study time:", error);
    return 0;
  }
}

// 3. Get Average Quiz Score (Score moyen)
async function getAverageQuizScore(userId: string) {
  try {
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      select: { percentage: true },
    });

    if (quizResults.length === 0) return 0;

    const totalPercentage = quizResults.reduce(
      (sum, result) => sum + result.percentage,
      0,
    );
    const average = Math.round(totalPercentage / quizResults.length);

    return average;
  } catch (error) {
    console.error("Error getting average score:", error);
    return 0;
  }
}
async function getTotalCoursesCount(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        grades: {
          select: {
            niveauId: true,
            subjects: {
              include: {
                courses: true,
              },
            },
          },
        },
      },
    });

    if (!user?.grades) return 0;

    let total = 0;
    for (const grade of user.grades) {
      total += grade.subjects.reduce((subTotal, subject) => {
        return subTotal + subject.courses.length;
      }, 0);
    }

    return total;
  } catch (error) {
    console.error("Error getting total courses:", error);
    return 0;
  }
}
// 4. Get Completed Courses Count (Cours complétés)
async function getCompletedCoursesCount(userId: string) {
  try {
    const completedCourses = await prisma.courseProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

    return completedCourses;
  } catch (error) {
    console.error("Error getting completed courses:", error);
    return 0;
  }
}

// Calculate course progress based on notes and quizzes
function calculateCourseProgress(course: any) {
  // You can implement more sophisticated progress calculation
  // For now, we'll check if there's any activity
  const hasNotes = course.notes && course.notes.length > 0;
  const hasQuizzes = course.quizzes && course.quizzes.length > 0;

  if (hasNotes && hasQuizzes) return 50;
  if (hasNotes || hasQuizzes) return 25;
  return 0;
}

// Format study time to human readable format
function formatStudyTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

async function getStudyStreak(userId: string): Promise<number> {
  try {
    // 1. Define the timeframe: Last 30 days (optional, can be removed to check indefinitely)
    // We get 'today' as the start of the current day in UTC to simplify date comparison.
    const today = new Date();
    // Set to the beginning of 'today' (midnight) in local time, then convert to UTC for consistent comparison with DB
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    // Check up to 30 days back, starting from the day *before* the check period (e.g., if checking up to today, 30 days before today).
    startDate.setDate(startDate.getDate() - 30);

    // 2. Fetch Distinct Study Dates
    // The query must return dates in a consistent format (e.g., UTC date string)
    // We use a safe cast for the raw query results.
    const activities: { study_date: Date }[] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT DISTINCT DATE_TRUNC('day', "completedAt" AT TIME ZONE 'UTC') as study_date
        FROM "QuizResult"
        WHERE "userId" = ${userId}
          AND "completedAt" >= ${startDate}
        UNION
        SELECT DISTINCT DATE_TRUNC('day', "completedAt" AT TIME ZONE 'UTC') as study_date
        FROM "CourseProgress"
        WHERE "userId" = ${userId}
          AND completed = true
          AND "completedAt" >= ${startDate}
        ORDER BY study_date DESC
      `,
    );

    // Convert the array of Date objects into a Set of YYYY-MM-DD strings for fast lookup.
    // Ensure all dates are treated as UTC for consistent string conversion.
    const activityDates = new Set<string>();
    for (const act of activities) {
      // study_date is a Date object representing the start of the day in UTC (from DATE_TRUNC)
      activityDates.add(act.study_date.toISOString().split("T")[0]);
    }

    let streak = 0;
    // Start checking from 'today' (which is already set to midnight)
    const currentDate = new Date(today);

    // 3. Check for consecutive days
    // We check for up to 30 days (or more if you remove the 30-day limit)
    for (let i = 0; i < 30; i++) {
      // Get the YYYY-MM-DD string for the current day being checked (in UTC)
      const dateStr = currentDate.toISOString().split("T")[0];

      if (activityDates.has(dateStr)) {
        // Activity found for this day
        streak++;
      } else {
        // No activity found for this day or an earlier day, streak is broken
        break;
      }

      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}
// Individual endpoint functions for each metric (optional)
export async function getCurrentSeriesEndpoint(userId: string) {
  const series = await getCurrentSeries(userId);
  return { currentSeries: series };
}

export async function getStudyTimeEndpoint(userId: string) {
  const time = await getTotalStudyTime(userId);
  return {
    totalStudyTime: time,
    formatted: formatStudyTime(time),
  };
}

export async function getAverageScoreEndpoint(userId: string) {
  const score = await getAverageQuizScore(userId);
  return { averageScore: score };
}

export async function getCompletedCoursesEndpoint(userId: string) {
  const count = await getCompletedCoursesCount(userId);
  return { completedCourses: count };
}

export async function saveLogs(
  userId: string,
  description: string,
  activity: ActivityType,
) {
  try {
    const res = await prisma.userActivity.create({
      data: {
        userId,
        type: activity || "OTHER",
        description: description || "",
      },
    });
    return res;
  } catch (error) {
    console.error("Error saving logs:", error);
  }
}

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale"; // OR en-US
import { Note } from "@/types/student";
import { uploadImage } from "./cours";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import z from "zod";

export async function getRecentActivities(userId: string) {
  try {
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log("Raw activities from DB:", activities);
    const mapped = await Promise.all(activities.map(mapUserActivityToUI));
    console.log("Mapped activities:", mapped);

    return mapped;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

export async function mapUserActivityToUI(activity: any) {
  let type: "completed" | "started" | "earned" | "downloaded" = "started";
  let title = activity.description || "Activité";

  // Convert createdAt to "5 min ago"
  const timestamp = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  switch (activity.type) {
    case "COMPLETE_COURSE":
      type = "completed";
      title = activity.description || "Cours terminé";
      break;

    case "START_COURSE":
      type = "started";
      title = activity.description || "Cours commencé";
      break;

    case "PASS_QUIZ":
      type = "completed";
      title = activity.description || "Quiz réussi";
      break;

    case "FAIL_QUIZ":
    case "COMPLETE_QUIZ":
      type = "completed";
      title = activity.description || "Quiz terminé";
      break;

    case "LOGIN":
      type = "earned";
      title = "Connexion réussie";
      break;

    case "UPDATE_PROFILE":
      type = "earned";
      title = activity.description || "Profil mis à jour";
      break;

    default:
      type = "started";
      title = activity.description || "Activité";
  }

  return {
    id: activity.id,
    type,
    title,
    timestamp,
  };
}
