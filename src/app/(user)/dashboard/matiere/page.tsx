import { getStudentById } from "@/actions/client";
import StudentSubjects from "../../_components/AllSubjects";

const MatierePage = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }

  // Aggregate all subjects from all grades the user has access to
  const allSubjects =
    user.grades?.flatMap(
      (grade: any) =>
        grade.subjects?.map((subject: any) => ({
          ...subject,
          gradeName: grade.name, // Add grade name for context
        })) || [],
    ) || [];

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <StudentSubjects subjects={allSubjects} userName={user.name} />
    </div>
  );
};

export default MatierePage;
