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

  // Check if user has access to this subject's grade (approved)
  const isGradeApproved = user.grades?.some(
    (grade: any) => grade.id === subject.gradeId,
  );

  // Check for pending demande for this grade
  const hasPendingDemande = user.demandeInscription?.some(
    (demande: any) =>
      demande.status === "PENDING" &&
      demande.grades.some((dg: any) => dg.gradeId === subject.gradeId),
  );

  // If the user doesn't have the grade approved AND doesn't have a pending demande for it,
  // we could redirect to dashboard, but let's allow viewing with locks as requested.
  // The user explicitly asked to see courses even if not approved but keep them locked.

  const coursesWithLockStatus = subject.courses.map((course: any) => ({
    ...course,
    isLocked: !isGradeApproved && !course.isFree,
  }));

  const processedSubject = {
    ...subject,
    courses: coursesWithLockStatus,
  };

  const progressCount = await getSubjectProgress(user.id, subject.id);

  // Verification banners logic
  const hasVerifiedStatus =
    user.StatutUser === "verified" || user.StatutUser === "subscribed";

  const hasApprovedSubscription = user.demandeInscription?.some(
    (demande: any) => demande.status === "APPROVED",
  );

  const isVerified = hasVerifiedStatus && hasApprovedSubscription;

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)] ">
      <CoursDetails
        subject={processedSubject}
        user={user}
        progressCount={progressCount}
        isVerified={isVerified}
        hasApprovedSubscription={hasApprovedSubscription}
      />
    </div>
  );
};

export default SubjectPage;
