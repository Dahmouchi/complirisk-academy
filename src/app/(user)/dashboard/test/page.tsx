import { getStudentById } from "@/actions/client";
import IndexNewDash from "@/components/newDash/Dashboard";

export default async function Page() {
  const user = await getStudentById();
  if (!user) {
    return <div className="text-center">User not found</div>;
  }
  return <IndexNewDash matieres={user.grade?.subjects} user={user} />;
}
