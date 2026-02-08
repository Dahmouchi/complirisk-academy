"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Subject, Grade, Niveau } from "@/types/menu";
import SubjectDialog from "./subject-dialog";
import { createSubject, deleteSubject, updateSubject } from "@/actions/grads";
import { toast } from "react-toastify";
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
import Loading from "@/components/Loading";
export default function MatieresPage({ niveauxx, classe, subject }: any) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNiveau, setSelectedNiveau] = useState<string>(
    "cmk1e7ue6000h0sroci9i2ev2",
  );
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setSubjects(subject);
      setGrades(classe);
      setNiveaux(niveauxx);
      setLoading(false);
    }, 1000);
  }, [subject, classe, niveauxx]);

  const filteredSubjects = subjects?.filter((subject) => {
    if (selectedGrade !== "all") {
      return subject.gradeId === selectedGrade;
    }
    if (selectedNiveau !== "all") {
      return subject.grade.niveauId === selectedNiveau;
    }
    return true;
  });

  const filteredGrades =
    selectedNiveau === "all"
      ? grades
      : grades.filter((grade) => grade.niveauId === selectedNiveau);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSubject(id);
      if (res.success) {
        toast.success("Le niveau a été supprimé avec succès");
        setIsDialogOpen(false);
        router.refresh();
      } else {
        toast.error("Erreur lors de la suppression du niveau");
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleSave = async (subjectData: {
    name: string;
    color: string;
    handler: string;
    gradeId: string;
    description: string;
  }) => {
    const grade = grades.find((g) => g.id === subjectData.gradeId);

    try {
      if (editingSubject) {
        // Modification
        const res = await updateSubject(
          editingSubject.id,
          subjectData.name,
          subjectData.color,
          subjectData.handler,
          subjectData.gradeId,
          subjectData.description,
        );
        if (res.success) {
          toast.success("Matire a été modifié avec succès");
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Erreur lors de la modification du niveau");
        }
      } else {
        // Création
        if (grade) {
          const res = await createSubject(
            subjectData.name,
            subjectData.color,
            subjectData.handler,
            grade.id,
            subjectData.description,
          );
          if (res.success) {
            toast.success("Matiere a été créée avec succès");
            setIsDialogOpen(false);
            router.refresh();
          } else {
            toast.error("Erreur lors de la création du niveau");
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };
  const handleNiveauChange = (niveauId: string) => {
    setSelectedNiveau(niveauId);
    setSelectedGrade("all");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gestion des Sections
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les sections de votre établissement par Norme
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Section
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtre par classe */}
            {selectedNiveau !== "all" && (
              <div>
                <h4 className="text-sm font-medium mb-2">Par Norme :</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={"outline"}
                    size="sm"
                    onClick={() => setSelectedGrade("all")}
                    className={
                      selectedGrade === "all"
                        ? "shadow-yellow-500/30 hover:shadow-yellow-500/40 bg-primary text-white"
                        : ""
                    }
                  >
                    Toutes les normes
                  </Button>
                  {filteredGrades.map((grade) => {
                    const count = subjects.filter(
                      (s) => s.gradeId === grade.id,
                    ).length;
                    return (
                      <Button
                        key={grade.id}
                        variant={"outline"}
                        size="sm"
                        onClick={() => setSelectedGrade(grade.id)}
                        className={
                          selectedGrade === grade.id
                            ? "shadow-yellow-500/30 hover:shadow-yellow-500/40 bg-primary text-white"
                            : ""
                        }
                      >
                        {grade.name} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Sections</CardTitle>
          <CardDescription>
            {filteredSubjects?.length} section
            {filteredSubjects?.length > 1 ? "s" : ""}
            {selectedGrade !== "all" &&
              ` dans ${grades.find((g) => g.id === selectedGrade)?.name}`}
            {selectedNiveau !== "all" &&
              selectedGrade === "all" &&
              ` dans ${niveaux.find((n) => n.id === selectedNiveau)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubjects?.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune section configurée
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre première section
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une matière
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Norme</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects?.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subject.grade.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subject.grade.niveau.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="text-sm text-gray-600 font-mono">
                          {subject.color}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(subject)}
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
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-700"
                                onClick={() => handleDelete(subject.id)}
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
          )}
        </CardContent>
      </Card>

      <SubjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        subject={editingSubject}
        grades={grades}
        onSave={handleSave}
      />
    </div>
  );
}
