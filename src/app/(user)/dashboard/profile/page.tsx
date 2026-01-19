export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getStudentById } from "@/actions/client";
import { getStudentDashboardStats } from "@/actions/student";
//import Profile from "../../_components/profile";
import StudentProfile from "@/components/student/StudentProfile";

const page = async () => {
  const user = await getStudentById();
  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }
  const stats = await getStudentDashboardStats(user.id);
  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <StudentProfile user={user} stats={stats} />
    </div>
  );
};

export default page;
