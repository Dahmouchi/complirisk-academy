import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { getStudentById } from "@/actions/client";
import { getSubjectProgress } from "@/actions/progress";
import prisma from "@/lib/prisma";
import CoursContainer from "../../_components/cours-container";
import HeaderSubject from "../../_components/headerSubject";

const CourseLayout = async ({ children, params }: any) => {
  const user = await getStudentById();
  if (!user) {
    return redirect("/");
  }

  const matiereInfo = await prisma.subject.findFirst({
    where: {
      handler: params.subjectId,
    },
    include: {
      courses: {
        include: {
          progress: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!matiereInfo) {
    return redirect("/");
  }
  const progressCount = await getSubjectProgress(user.id, matiereInfo.id);

  return (
    <>
      <div
        className="flex-col   "
        style={{
          backgroundImage: `url("/Board.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <HeaderSubject user={user} />
        <div className=" lg:p-4 p-2">
          <div className=" flex-row items-center gap-2 lg:hidden flex p-2 dark:bg-slate-700 bg-white rounded-md shadow-sm">
            <Link
              href={`/dashboard/matiere/${matiereInfo.handler}`}
              className="flex items-center text-center gap-2  rounded-md hover:bg-main"
            >
              <div className="rounded-md flex items-center justify-center h-12 bg-slate-200 w-12 p-2 dark:bg-slate-900 dark:hover:bg-slate-700  text-main hover:text-white">
                <ChevronLeft />
              </div>
            </Link>
            <div className="text-2xl lg:text-3xl dark:text-slate-100 text-gray-800 font-bold text-center">
              {matiereInfo.name}
            </div>
          </div>
          <div className="flex-col-reverse sm:flex sm:flex-row-reverse sm:space-x-4 w-full gap-3">
            <div className="flex-col sm:w-[70%] mt-4 sm:mt-0 h-fit sticky top-0">
              {children}
            </div>
            <div className="block lg:mt-0 mt-2 rounded-[8px] border-[1px] border-gray-200 dark:border-gray-700 p-4 shadow-md w-full sm:w-[30%] h-fit sm:h-fit mb-3 bg-white dark:bg-slate-900">
              <div className="mb-2 flex-col justify-between iems-center w-full">
                <div className="sm:flex flex items-center text-gray-500 w-full">
                  {/* 
                <div className="ml-auto">
                  <CoursProgressCercle userProgress={progressCount} />
                </div>*/}
                </div>
                <div className=" flex-row items-center gap-2 lg:flex hidden">
                  <Link
                    href={`/dashboard/matiere/${matiereInfo.handler}`}
                    className="flex items-center text-center gap-2 bg-gray-200 rounded-md hover:bg-blue-600 dark:bg-slate-950 dark:hover:bg-slate-700"
                  >
                    <div className="rounded-md flex items-center justify-center h-12 w-12 p-2  text-blue-600f hover:text-white">
                      <ChevronLeft />
                    </div>
                  </Link>
                  <div className="text-2xl lg:text-3xl dark:text-slate-100 text-gray-800 font-bold text-center">
                    {matiereInfo.name}
                  </div>
                </div>
                <div className="my-3">
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 ">
                    <div
                      className="bg-blue-600 text-[10px] text-white font-semibold text-center p-0.5 leading-none rounded-full"
                      style={{
                        width: `${
                          Math.floor(progressCount.percentage) === 0
                            ? 5
                            : Math.floor(progressCount.percentage)
                        }%`,
                      }}
                    >
                      {Math.floor(progressCount.percentage)}%
                    </div>
                  </div>
                  <h1 className="mt-2">
                    {matiereInfo.courses.length} Lectures{" "}
                    <span className="text-xl"> | </span>{" "}
                    <span className="text-blue-500 font-bold text-lg">
                      {Math.floor(progressCount.percentage)}% Complété
                    </span>
                  </h1>
                </div>
              </div>
              <div className=" flex-col h-[50vh] md:h-screen lg:h-[100vh] overflow-y-auto ">
                <div className="flex-col space-y-4">
                  <CoursContainer
                    cour={matiereInfo.courses}
                    userId={user.id}
                    subjectId={params.subjectId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseLayout;
