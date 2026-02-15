import { getGrades } from "@/actions/teacher";
import ExplorePage from "@/components/newDash/ExplorePage";
import { getStudentById } from "@/actions/client";
import prisma from "@/lib/prisma";
import { getCart } from "@/app/(user)/_actions/cartActions";

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

  // Get user's cart
  const cartResult = await getCart();
  const cart = cartResult.success ? cartResult.cart : null;

  return (
    <div>
      <ExplorePage
        matieres={courses}
        user={user}
        pendingDemande={pendingDemande}
        initialCart={cart}
      />
    </div>
  );
}
