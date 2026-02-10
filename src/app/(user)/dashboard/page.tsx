import React from "react";
import { getStudentById } from "@/actions/client";
import { getQuizzesGroupedByMatiere } from "@/actions/quizResults";
import {
  getStudentDashboardStats,
  getRecentActivities,
} from "@/actions/student";
import IndexNewDash from "@/components/newDash/Dashboard";
import ModernStudentSpace from "../_components/homePage";
import prisma from "@/lib/prisma";
import { getSubjectProgress } from "@/actions/progress";

const page = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  const stats = await getStudentDashboardStats(user.id);
  const recentActivities = await getRecentActivities(user.id);

  // Fetch all available grades for the modify demande dialog
  const allGrades = await prisma.grade.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Use the user's approved grades for display
  const displayGrades = user.grades || [];

  // Pre-fetch subject progress for all subjects
  const subjectProgressMap: Record<
    string,
    { completed: number; total: number; percentage: number }
  > = {};

  for (const grade of displayGrades) {
    if (grade.subjects) {
      for (const subject of grade.subjects) {
        const progress = await getSubjectProgress(user.id, subject.id);
        subjectProgressMap[subject.id] = progress;
      }
    }
  }

  //const quizzes = await getQuizzesGroupedByMatiere(user.id);
  //const stats = await getStudentDashboardStats(user.id);

  return (
    <>
      <IndexNewDash
        matieres={displayGrades}
        user={user}
        stats={stats}
        recentActivities={recentActivities}
        allGrades={allGrades}
        subjectProgress={subjectProgressMap}
      />
      {/*<IndexCinq matieres={user.grade?.subjects} user={user} />
      <ModernStudentSpace user = {user} quizzes = {quizzes.data}/>
      <StudentDashboard user={user} quizzes={quizzes.data} stats={stats} />*/}
    </>
  );
};

export default page;
