import { getStudentById } from "@/actions/client";
import StudentSubjects from "../../_components/AllSubjects";

const MatierePage = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <StudentSubjects subjects={user.grade?.subjects} userName={user.name} />
    </div>
  );
};

export default MatierePage;
