import { getGrades } from "@/actions/teacher";
import ExplorePage from "@/components/newDash/ExplorePage";
import { getStudentById } from "@/actions/client";
import prisma from "@/lib/prisma";

export default async function CoursesPage() {
  const user = await getStudentById();
  if (!user) {
    return <div>Accès non autorisé</div>;
  }

  const courses = await getGrades();

  // Find any pending demande for the user
  const pendingDemande = user.demandeInscription?.find(
    (d: any) => d.status === "PENDING",
  );

  return (
    <div>
      <ExplorePage
        matieres={courses}
        user={user}
        pendingDemande={pendingDemande}
      />
    </div>
  );
}
