import React from "react";
import { getStudentById } from "@/actions/client";
import { getQuizzesGroupedByMatiere } from "@/actions/quizResults";
import { getStudentDashboardStats } from "@/actions/student";
import IndexCinq from "@/components/cinq/Index";

const page = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  //const quizzes = await getQuizzesGroupedByMatiere(user.id);
  //const stats = await getStudentDashboardStats(user.id);

  return (
    <div className="lg:px-16 px-2">
      <IndexCinq matieres={user.grade?.subjects} user={user} />
      {/*<ModernStudentSpace user = {user} quizzes = {quizzes.data}/>
      <StudentDashboard user={user} quizzes={quizzes.data} stats={stats} />*/}
    </div>
  );
};

export default page;
