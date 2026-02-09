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

  // Fetch the subject with its grade information
  const subject = await prisma.subject.findFirst({
    where: {
      id: params.id,
    },
    include: {
      grade: true, // Include grade information
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
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!subject) {
    return redirect("/dashboard");
  }

  // Verify that the user has access to this subject's grade
  const hasAccess = user.grades?.some(
    (grade: any) => grade.id === subject.gradeId,
  );

  if (!hasAccess) {
    return redirect("/dashboard");
  }

  // Filter courses based on user verification status AND subscription approval
  // User needs BOTH verified/subscribed status AND approved subscription request
  const hasVerifiedStatus =
    user.StatutUser === "verified" || user.StatutUser === "subscribed";

  // Check if user has an approved subscription request
  const hasApprovedSubscription = user.demandeInscription?.some(
    (demande: any) => demande.status === "APPROVED",
  );

  // User is fully verified if they have verified status AND approved subscription
  const isVerified = hasVerifiedStatus && hasApprovedSubscription;

  const filteredSubject = {
    ...subject,
    courses: isVerified
      ? subject.courses
      : subject.courses.filter((course: any) => course.isFree),
  };

  const progressCount = await getSubjectProgress(user.id, subject.id);

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)]">
      <CoursDetails
        subject={filteredSubject}
        user={user}
        progressCount={progressCount}
        isVerified={isVerified}
        hasApprovedSubscription={hasApprovedSubscription}
      />
    </div>
  );
};

export default SubjectPage;
