import React from "react";
import { getStudentById } from "@/actions/client";
import { getQuizzesGroupedByMatiere } from "@/actions/quizResults";
import { getStudentDashboardStats } from "@/actions/student";
import IndexNewDash from "@/components/newDash/Dashboard";
import IndexNewDashLive from "@/components/newDash/DashboardLive";

const page = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  //const quizzes = await getQuizzesGroupedByMatiere(user.id);
  //const stats = await getStudentDashboardStats(user.id);

  return (
    <>
      <IndexNewDashLive matieres={user.grade?.subjects} user={user} />
      {/*<IndexCinq matieres={user.grade?.subjects} user={user} />
      <ModernStudentSpace user = {user} quizzes = {quizzes.data}/>
      <StudentDashboard user={user} quizzes={quizzes.data} stats={stats} />*/}
    </>
  );
};

export default page;
