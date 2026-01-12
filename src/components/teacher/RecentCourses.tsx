import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Progress from "../ui/progress";

const courses = [
  {
    id: 1,
    title: "Mécanique des Sols",
    students: 28,
    progress: 65,
    lessons: 12,
    completedLessons: 8,
    status: "active",
  },
  {
    id: 2,
    title: "Béton Armé Avancé",
    students: 45,
    progress: 42,
    lessons: 16,
    completedLessons: 7,
    status: "active",
  },
  {
    id: 3,
    title: "Hydraulique Urbaine",
    students: 32,
    progress: 88,
    lessons: 10,
    completedLessons: 9,
    status: "active",
  },
  {
    id: 4,
    title: "Résistance des Matériaux",
    students: 50,
    progress: 100,
    lessons: 14,
    completedLessons: 14,
    status: "completed",
  },
];

const RecentCourses = () => {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Mes cours
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {course.title}
                </p>
                {course.status === "completed" && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                    Terminé
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {course.students} étudiants
                </span>
                <span>
                  {course.completedLessons}/{course.lessons} leçons
                </span>
              </div>
              <Progress value={course.progress} className="mt-2 h-1.5" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentCourses;
