export const dynamic = "force-dynamic";
export const revalidate = 0;
import AccessDenied from "@/components/access";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Timer from "../_components/Timer";
import { FloatingNotesButton } from "../_components/notes/FloatingNotesButton";
import { BadgeNotification } from "../_components/BadgNotification";
import { StudentHeader } from "@/components/student/StudentHeader";
import { getStudentById } from "@/actions/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session?.user);
  if (!session) {
    redirect("/");
  }
  if (session && session.user.step < 2) {
    redirect("/steps");
  }
  if (session.user.role !== "USER") {
    return <AccessDenied role={session.user.role} />;
  }
  const user = await getStudentById();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Timer user={session.user} />
      <StudentHeader
        userName={`${user?.name} ${user?.prenom}` || ""}
        userAvatar={user?.image || ""}
        userEmail={user?.email || ""}
      />
      <div className="bg-[#efefef] flex-1 overflow-hidden ">{children}</div>
      <FloatingNotesButton userId={session.user.id} />
      <BadgeNotification />
    </div>
  );
}
