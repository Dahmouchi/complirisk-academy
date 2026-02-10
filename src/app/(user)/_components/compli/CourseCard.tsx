import {
  Clock,
  Users,
  BookOpen,
  Play,
  Lock as LucideLock,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Progress from "@/components/ui/progress";
import Link from "next/link";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  enrolled: number;
  price: number;
  isFree?: boolean;
  isLocked?: boolean;
  progress?: number;
  level: "Foundation" | "Practitioner" | "Lead Auditor";
  image: string;
  subjectId: string;
  instructor: string;
}

interface CourseCardProps {
  course: Course;
}

const levelColors = {
  Foundation: "bg-info/10 text-info border-info/20",
  Practitioner: "bg-warning/10 text-warning border-warning/20",
  "Lead Auditor": "bg-success/10 text-success border-success/20",
};

export function CourseCard({ course }: CourseCardProps) {
  const CardWrapper = course.isLocked ? "div" : Link;
  const wrapperProps = course.isLocked
    ? { className: "block h-full cursor-not-allowed" }
    : {
        href: `/dashboard/matiere/${course.subjectId}`,
        className: "block h-full",
      };

  return (
    <Card
      className={cn(
        "group py-0 h-full overflow-hidden transition-all duration-300 animate-scale-in relative",
        !course.isLocked && "hover:shadow-xl hover:-translate-y-1",
      )}
    >
      <CardContent className="p-0 h-full">
        <CardWrapper {...(wrapperProps as any)}>
          <div className="relative h-40 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500",
                !course.isLocked && "group-hover:scale-110",
                course.isLocked && "grayscale",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

            {course.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                <div className="bg-background/80 p-3 rounded-full shadow-lg">
                  <LucideLock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            )}

            <Badge
              className={cn(
                "absolute top-3 left-3 border",
                levelColors[course.level],
              )}
            >
              {course.level}
            </Badge>
            {course.isFree && (
              <Badge className="absolute top-3 right-3 bg-green-400 px-3 py-1 rounded-full text-white border-none">
                Gratuit
              </Badge>
            )}
            {!course.isFree && course.isLocked && (
              <Badge className="absolute top-3 right-3 bg-warning/80 px-3 py-1 rounded-full text-white border-none">
                Verrouillé
              </Badge>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between">
            <div>
              <h3
                className={cn(
                  "font-display font-semibold text-lg mb-2 line-clamp-2 transition-colors",
                  !course.isLocked && "group-hover:text-primary",
                )}
              >
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {(course.instructor || "Expert")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <span className="text-sm text-muted-foreground">
                  {course.instructor}
                </span>
              </div>
              <Button size="sm" className="gap-1.5" disabled={course.isLocked}>
                {course.isLocked ? (
                  <LucideLock className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {course.isLocked
                  ? "Verrouillé"
                  : course.progress
                    ? "Continue"
                    : "Commencer"}
              </Button>
            </div>
          </div>
        </CardWrapper>
      </CardContent>
    </Card>
  );
}
