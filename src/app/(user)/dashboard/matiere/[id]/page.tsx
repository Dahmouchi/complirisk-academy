import { redirect } from "next/navigation";
import { getStudentById } from "@/actions/client";
import prisma from "@/lib/prisma";
import { getSubjectProgress } from "@/actions/progress";
import CoursDetails from "@/app/(user)/_components/CoursDtails";

const SubjectPage = async ({ params }: any) => {
  const user = await getStudentById();
  if (!user) {
    return redirect("/");
  }

  const subject = await prisma.subject.findFirst({
    where: {
      id: params.id,
    },
    include: {
      courses: {
        include: {
          documents: true,
          quizzes: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!subject) {
    return redirect("/dashboard");
  }
  const progressCount = await getSubjectProgress(user.id, subject.id);
  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <CoursDetails
        subject={subject}
        user={user}
        progressCount={progressCount}
      />
    </div>
  );
};

export default SubjectPage;
