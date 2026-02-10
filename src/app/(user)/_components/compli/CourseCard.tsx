import { Clock, Users, BookOpen, Play } from "lucide-react";
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
  return (
    <Card className="group py-0 h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in">
      <CardContent className="p-0 h-full">
        <Link href={`/dashboard/matiere/${course.subjectId}`}>
          <div className="relative h-40 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
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
          </div>
          <div className="p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-sm text-muted-foreground">
                  {course.instructor}
                </span>
              </div>
              <Button size="sm" className="gap-1.5">
                <Play className="h-3.5 w-3.5" />
                {course.progress ? "Continue" : "Commencer"}
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
