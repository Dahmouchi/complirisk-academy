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
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import NiveauDialog from "../_components/niveaux-dialog";
import { Niveau } from "@/types/menu";
import { createNiveau, deleteNiveau, updateNiveau } from "@/actions/grads";
import Loading from "@/components/Loading";
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
// Données simulées pour le développement

const NiveauxPage = ({ niveauxx }: { niveauxx: any }) => {
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNiveau, setEditingNiveau] = useState<Niveau | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setNiveaux(niveauxx);
      setLoading(false);
    }, 1000);
  }, [niveauxx]);

  const handleCreate = () => {
    setEditingNiveau(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (niveau: Niveau) => {
    setEditingNiveau(niveau);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteNiveau(id);
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

  const handleSave = async (niveauData: { name: string }) => {
    try {
      if (editingNiveau) {
        // Modification
        const res = await updateNiveau(editingNiveau.id, niveauData.name);
        if (res.success) {
          toast.success("Le niveau a été modifié avec succès");
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Erreur lors de la modification du niveau");
        }
      } else {
        // Création
        const res = await createNiveau(niveauData.name);
        if (res.success) {
          toast.success("Le niveau a été créé avec succès");
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Erreur lors de la création du niveau");
        }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Niveaux
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les niveaux d&apos;éducation de votre établissement
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nouveau Niveau
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Niveaux</CardTitle>
          <CardDescription>
            {niveaux.length} niveau{niveaux.length > 1 ? "s" : ""} configuré
            {niveaux.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {niveaux.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun niveau configuré
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre premier niveau d&apos;éducation
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un niveau
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Niveau</TableHead>
                  <TableHead>Nombre de Classes</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {niveaux.map((niveau) => (
                  <TableRow key={niveau?.id}>
                    <TableCell className="font-medium">
                      {niveau?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {niveau?.grades?.length} classe
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {niveau?.grades?.slice(0, 3).map((grade: any) => (
                          <Badge
                            key={grade?.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {grade?.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(niveau)}
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
                                onClick={() => handleDelete(niveau.id)}
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

      <NiveauDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        niveau={editingNiveau}
        onSave={handleSave}
      />
    </div>
  );
};
export default NiveauxPage;
