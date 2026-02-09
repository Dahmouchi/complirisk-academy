"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { X, Plus, User, Mail, Phone, Clock, GraduationCap } from "lucide-react";
import {
  addGradeToUser,
  removeGradeFromUser,
  getAllGrades,
} from "@/actions/client";

interface UserGradeManagerProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserGradeManager({
  user,
  open,
  onOpenChange,
}: UserGradeManagerProps) {
  const [availableGrades, setAvailableGrades] = useState<any[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [userGrades, setUserGrades] = useState<any[]>(user.grades || []);

  useEffect(() => {
    if (open) {
      loadAvailableGrades();
    }
  }, [open]);

  const loadAvailableGrades = async () => {
    try {
      const grades = await getAllGrades();
      setAvailableGrades(grades);
    } catch (error) {
      console.error("Error loading grades:", error);
      toast.error("Erreur lors du chargement des niveaux");
    }
  };

  const handleAddGrade = async () => {
    if (!selectedGradeId) {
      toast.error("Veuillez sélectionner un niveau");
      return;
    }

    // Check if user already has this grade
    if (userGrades.some((g) => g.id === selectedGradeId)) {
      toast.error("L'utilisateur a déjà ce niveau");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addGradeToUser(user.id, selectedGradeId);
      if (result.success) {
        toast.success("Niveau ajouté avec succès");
        // Add the new grade to the local state
        const addedGrade = availableGrades.find(
          (g) => g.id === selectedGradeId,
        );
        if (addedGrade) {
          setUserGrades([...userGrades, addedGrade]);
        }
        setSelectedGradeId("");
      } else {
        toast.error(result.message || "Erreur lors de l'ajout du niveau");
      }
    } catch (error) {
      console.error("Error adding grade:", error);
      toast.error("Erreur lors de l'ajout du niveau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGrade = async (gradeId: string) => {
    if (userGrades.length === 1) {
      toast.error("L'utilisateur doit avoir au moins un niveau");
      return;
    }

    setIsLoading(true);
    try {
      const result = await removeGradeFromUser(user.id, gradeId);
      if (result.success) {
        toast.success("Niveau retiré avec succès");
        setUserGrades(userGrades.filter((g) => g.id !== gradeId));
      } else {
        toast.error(result.message || "Erreur lors du retrait du niveau");
      }
    } catch (error) {
      console.error("Error removing grade:", error);
      toast.error("Erreur lors du retrait du niveau");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDurationFromSeconds = (seconds: number): string => {
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hoursPart = hours > 0 ? `${hours}h` : "";
    const minutesPart = minutes > 0 ? `${minutes}min` : "";
    const secondsPart = remainingSeconds > 0 ? `${remainingSeconds}s` : "";

    return `${hoursPart} ${minutesPart} ${secondsPart}`.trim() || "0s";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Fiche de l&apos;utilisateur
          </DialogTitle>
          <DialogDescription>
            Gérer les informations et les niveaux de l&apos;utilisateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">
              Informations personnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {user.name} {user.prenom}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="font-medium">{user.phone || "Non renseigné"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Temps de visionnage</p>
                  <p className="font-medium">
                    {formatDurationFromSeconds(user.totalTimeSpent || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500">Statut</p>
              <div className="mt-1">
                {user.StatutUser === "verified" ? (
                  <Badge className="bg-green-500">Vérifié</Badge>
                ) : user.StatutUser === "awaiting" ? (
                  <Badge className="bg-yellow-500">En attente</Badge>
                ) : (
                  <Badge className="bg-red-500">Inscrit</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Grades Management Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Niveaux assignés</h3>
            </div>

            {/* Current Grades */}
            <div className="space-y-2">
              {userGrades.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {userGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div>
                        <p className="font-medium">{grade.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {grade.niveau?.name}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGrade(grade.id)}
                        disabled={isLoading || userGrades.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun niveau assigné</p>
              )}
            </div>

            {/* Add New Grade */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Ajouter un nouveau niveau</h4>
              <div className="flex gap-2">
                <Select
                  value={selectedGradeId}
                  onValueChange={setSelectedGradeId}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGrades
                      .filter(
                        (grade) => !userGrades.some((ug) => ug.id === grade.id),
                      )
                      .map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.niveau?.name} - {grade.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddGrade}
                  disabled={isLoading || !selectedGradeId}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
