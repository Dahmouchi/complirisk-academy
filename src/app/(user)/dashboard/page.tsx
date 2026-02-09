import React from "react";
import { getStudentById } from "@/actions/client";
import { getQuizzesGroupedByMatiere } from "@/actions/quizResults";
import {
  getStudentDashboardStats,
  getRecentActivities,
} from "@/actions/student";
import IndexNewDash from "@/components/newDash/Dashboard";
import ModernStudentSpace from "../_components/homePage";

const page = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  const stats = await getStudentDashboardStats(user.id);
  const recentActivities = await getRecentActivities(user.id);

  //const quizzes = await getQuizzesGroupedByMatiere(user.id);
  //const stats = await getStudentDashboardStats(user.id);

  return (
    <>
      <IndexNewDash
        matieres={user.grades}
        user={user}
        stats={stats}
        recentActivities={recentActivities}
      />
      {/*<IndexCinq matieres={user.grade?.subjects} user={user} />
      <ModernStudentSpace user = {user} quizzes = {quizzes.data}/>
      <StudentDashboard user={user} quizzes={quizzes.data} stats={stats} />*/}
    </>
  );
};

export default page;
