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
import { Plus, Edit, Trash2, Users } from "lucide-react";
import GradeDialog from "../_components/grade-dialog";
import { Grade, Niveau } from "@/types/menu";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createClasse, deleteClasse, updateClasse } from "@/actions/grads";
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

export default function ClassesPage({ niveauxx, classe }: any) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNiveau, setSelectedNiveau] = useState<string>("all");
  const router = useRouter();
  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setGrades(classe);
      setNiveaux(niveauxx);
      setLoading(false);
    }, 1000);
  }, [classe, niveauxx]);

  const filteredGrades =
    selectedNiveau === "all"
      ? grades
      : grades.filter((grade) => grade.niveauId === selectedNiveau);

  const handleCreate = () => {
    setEditingGrade(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteClasse(id);
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

  const handleSave = async (gradeData: {
    name: string;
    niveauId: string;
    price: number;
  }) => {
    const niveau = niveaux.find((n) => n.id === gradeData.niveauId);

    try {
      if (editingGrade) {
        // Modification
        const res = await updateClasse(
          editingGrade.id,
          gradeData.price,
          gradeData.name,
          gradeData.niveauId,
        );
        if (res.success) {
          toast.success("Le niveau a été modifié avec succès");
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Erreur lors de la modification du niveau");
        }
      } else {
        // Création

        const res = await createClasse(gradeData.name, gradeData.price);
        if (res.success) {
          toast.success("Classe a été créée avec succès");
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Erreur lors de la création du niveau");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion des Normes
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les normes de votre établissement par niveau
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Norme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Normes</CardTitle>
          <CardDescription>
            {filteredGrades.length} norme{filteredGrades.length > 1 ? "s" : ""}
            {selectedNiveau !== "all" &&
              ` dans ${niveaux.find((n) => n.id === selectedNiveau)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGrades.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedNiveau === "all"
                  ? "Aucune norme configurée"
                  : `Aucune norme dans ${
                      niveaux.find((n) => n.id === selectedNiveau)?.name
                    }`}
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre première norme
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une norme
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Norme</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Nombre de Sections</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>{grade.price} MAD</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {grade.subjects.length} section
                        {grade.subjects.length > 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {grade.subjects.slice(0, 3).map((subject: any) => (
                          <Badge
                            key={subject.id}
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: subject.color + "20",
                              borderColor: subject.color,
                            }}
                          >
                            {subject.name}
                          </Badge>
                        ))}
                        {grade.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{grade.subjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(grade)}
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
                                onClick={() => handleDelete(grade.id)}
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

      <GradeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        grade={editingGrade}
        niveaux={niveaux}
        onSave={handleSave}
      />
    </div>
  );
}
