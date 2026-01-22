import TeacherSettings from "@/components/teacher/TeacherSettings";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER") {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teacherSubjects: {
        include: {
          subject: {
            include: {
              grade: true,
            },
          },
          grade: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <TeacherSettings user={user} />
    </div>
  );
};

export default SettingsPage;
