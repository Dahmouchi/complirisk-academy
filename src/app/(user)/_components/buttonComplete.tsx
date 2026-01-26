"use client"; // Add this at the top since we need client-side interactivity

import { useEffect, useState } from "react";
import { Check, Timer } from "lucide-react"; // Import a check icon
import { completeCourse, getCourseCompletionStatus } from "@/actions/progress";
import { useRouter } from "next/navigation";

const ButtonComplete = (params: any) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchCompletionStatus = async () => {
      const res = await getCourseCompletionStatus(
        params.userId,
        params.course.id,
      );
      setIsCompleted(res.completed);
    };
    fetchCompletionStatus();
  }, [params.userId, params.course.id]);
  const handleCompleteCourse = async () => {
    try {
      setIsLoading(true);
      await completeCourse(params.userId, params.course.id);
      setIsCompleted(true);
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Failed to complete course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCompleteCourse}
      disabled={isCompleted || isLoading}
      className="relative inline-flex lg:w-fit h-12 w-full active:scale-95 transition overflow-hidden rounded-[8px] p-[1px] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"></span>
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[8px] bg-gradient-to-br from-purple-600 to-blue-600 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2">
        {isCompleted ? (
          <>
            Cours terminé
            <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            {isLoading ? "En cours..." : "Marquer comme terminé"}
            {!isLoading && <Timer className="w-5 h-5" />}
          </>
        )}
      </span>
    </button>
  );
};

export default ButtonComplete;
