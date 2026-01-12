import { getStudentRegister } from "@/actions/client";
import StudentLivesPage from "@/components/cinq/Lives";
import Lives from "@/components/cinq/NewLive";

export default async function Live() {
  const user = await getStudentRegister();
  return (
    <div className="mt-8">
      {user ? (
        <div>
          <StudentLivesPage />
        </div>
      ) : (
        <div className="lg:px-16 px-2">
          <Lives />
        </div>
      )}
    </div>
  );
}
