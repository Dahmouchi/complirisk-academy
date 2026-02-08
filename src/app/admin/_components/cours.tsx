/* eslint-disable jsx-a11y/alt-text */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlayCircle,
  Plus,
  Edit,
  Trash2,
  FileText,
  Video,
  Image,
  ArrowUpDown,
} from "lucide-react";
import { Course, Subject, Grade } from "@/types/menu";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCourse } from "@/actions/cours";
import { toast } from "react-toastify";
export default function CoursesPage({ classe, subject, coures }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const router = useRouter();
  // We'll need a map of subjectId to gradeId for efficient lookups
  const [subjectGradeMap, setSubjectGradeMap] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setSubjects(subject);
      setGrades(classe);
      setCourses(coures);
      // Create a map of subjectId to gradeId
      const map: Record<string, string> = {};
      subject.forEach((s: Subject) => {
        map[s.id] = s.gradeId;
      });
      setSubjectGradeMap(map);

      setLoading(false);
    }, 1000);
  }, [subject, classe, coures]);

  // Filter courses based on selected grade and subject
  const filteredCourses = useMemo(() => {
    let result = courses;

    // First filter by grade if not 'all'
    if (selectedGrade !== "all") {
      result = result.filter((course) => {
        const subjectGradeId = subjectGradeMap[course.subjectId];
        return subjectGradeId === selectedGrade;
      });
    }

    // Then filter by subject if not 'all'
    if (selectedSubject !== "all") {
      result = result.filter((course) => course.subjectId === selectedSubject);
    }

    return result;
  }, [courses, selectedGrade, selectedSubject, subjectGradeMap]);

  // Get subjects filtered by selected grade
  const filteredSubjects = useMemo(() => {
    if (selectedGrade === "all") return subjects;

    return subjects.filter((subject) => subject.gradeId === selectedGrade);
  }, [subjects, selectedGrade]);

  // Get counts for subjects (within selected grade)
  const getSubjectCounts = () => {
    const counts: Record<string, number> = {};

    courses.forEach((course) => {
      const subjectGradeId = subjectGradeMap[course.subjectId];

      // Only count if in selected grade (or all grades)
      if (selectedGrade === "all" || subjectGradeId === selectedGrade) {
        counts[course.subjectId] = (counts[course.subjectId] || 0) + 1;
      }
    });

    return counts;
  };

  const subjectCounts = getSubjectCounts();

  // Get counts for grades
  const getGradeCounts = () => {
    const counts: Record<string, number> = {};

    courses.forEach((course) => {
      const subjectGradeId = subjectGradeMap[course.subjectId];
      counts[subjectGradeId] = (counts[subjectGradeId] || 0) + 1;
    });

    return counts;
  };

  const gradeCounts = getGradeCounts();
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCourse(id);
      if (res.success) {
        toast.success("Le niveau a été supprimé avec succès");
        router.refresh();
      } else {
        toast.error("Erreur lors de la suppression du niveau");
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue");
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PlayCircle className="h-6 w-6" />
            Gestion des Cours
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les cours de votre établissement par niveau et matière
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/admin/dashboard/cours/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Cours
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Grade filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Par norme :
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGrade === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedGrade("all");
                    setSelectedSubject("all"); // Reset subject when changing grade
                  }}
                  className="flex items-center gap-2"
                >
                  Toutes les normes ({courses.length})
                </Button>
                {grades.map((grade) => (
                  <Button
                    key={grade.id}
                    variant={selectedGrade === grade.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedGrade(grade.id);
                      setSelectedSubject("all"); // Reset subject when changing grade
                    }}
                    className="flex items-center gap-2"
                  >
                    {grade.name} ({gradeCounts[grade.id] || 0})
                  </Button>
                ))}
              </div>
            </div>

            {/* Subject filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Par Section :
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSubject === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject("all")}
                  className="flex items-center gap-2"
                >
                  Toutes les sections (
                  {selectedGrade === "all"
                    ? courses.length
                    : courses.filter(
                        (c) => subjectGradeMap[c.subjectId] === selectedGrade,
                      ).length}
                  )
                </Button>
                {filteredSubjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={
                      selectedSubject === subject.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedSubject(subject.id)}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor:
                        selectedSubject === subject.id
                          ? subject.color
                          : undefined,
                      borderColor: subject.color,
                      color:
                        selectedSubject === subject.id
                          ? "white"
                          : subject.color,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    {subject.name} ({subjectCounts[subject.id] || 0})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des Cours</span>
            <Badge variant="secondary">{filteredCourses.length} cours</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun cours
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedSubject === "all"
                  ? "Commencez par créer votre premier cours."
                  : "Aucun cours trouvé pour cette matière."}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/admin/dashboard/cours/add")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Cours
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>section</TableHead>
                    <TableHead className="text-center">
                      <ArrowUpDown className="h-4 w-4 inline" /> Ordre
                    </TableHead>
                    <TableHead className="text-center">Contenu</TableHead>
                    <TableHead className="text-center">Documents</TableHead>
                    <TableHead className="text-center">Quiz</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses
                    .sort((a, b) => a.index - b.index)
                    .map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {course.coverImage && (
                              <Image className="h-4 w-4 text-blue-500" />
                            )}
                            <div>
                              <div className="font-medium max-w-sm truncate">
                                {course.title}
                              </div>
                              {course.content && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {course.content}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: course.subject.color }}
                            />
                            <span>{course.subject.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant="outline">{course.index}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-1">
                            {course.videoUrl && (
                              <Video className="h-4 w-4 text-red-500" />
                            )}
                            {course.content && (
                              <FileText className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {course.documents?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {course.quizzes?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/cours/${course.handler}`,
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 text-white hover:bg-red-700"
                                    onClick={() => handleDelete(course.id)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
