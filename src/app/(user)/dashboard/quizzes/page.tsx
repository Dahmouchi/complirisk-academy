import { getStudentById } from "@/actions/client";
import { getQuizzesGroupedByMatiere } from "@/actions/quizResults";
import StudentQuizzes from "../../_components/AllQuizzes";

const QuizzesPage = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  const quizzes = await getQuizzesGroupedByMatiere(user.id);

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <StudentQuizzes quizzes={quizzes.data} user={user} />
    </div>
  );
};

export default QuizzesPage;
