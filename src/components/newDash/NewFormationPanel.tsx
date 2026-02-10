"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  ShoppingCart,
  Loader2,
  Package,
  CreditCard,
  Mail,
  Phone,
  Edit,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  cancelDemande,
  createNewDemande,
} from "@/app/(user)/_actions/createNewDemande";
import { useRouter } from "next/navigation";
import { ModifyDemandeDialog } from "@/app/(user)/_components/compli/ModifyDemandeDialog";
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
} from "../ui/alert-dialog";

interface Grade {
  id: string;
  name: string;
  price: number;
}

interface PendingDemande {
  id: string;
  totalPrice: number;
  status: string;
  grades: {
    grade: {
      id: string;
      name: string;
    };
    gradePrice: number;
  }[];
}

interface NewFormationPanelProps {
  availableGrades: Grade[];
  userId: string;
  userGrades?: { id: string }[]; // User's current grades
  pendingDemande?: PendingDemande | null; // Existing pending demande if any
}

export default function NewFormationPanel({
  availableGrades,
  userId,
  userGrades = [],
  pendingDemande = null,
}: NewFormationPanelProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    if (pendingDemande?.id) {
      setIsDialogOpen(true);
    }
  };

  const handleCancelDemande = async (demandeId: string) => {
    try {
      const res = await cancelDemande(demandeId);
      if (res.success) {
        toast.success("Demande annulée avec succès");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(
        "Une erreur s'est produite lors de l'annulation de la demande",
      );
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  // If there's a pending demande, show the status card
  if (pendingDemande) {
    const selectedCourses = pendingDemande.grades.map((dg) => ({
      id: dg.grade.id,
      name: dg.grade.name,
      price: dg.gradePrice,
    }));

    return (
      <Card className="border-warning/30 bg-white top-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-warning animate-spin" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">
                Demande en cours de traitement
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Votre demande est en cours d&apos;examen
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Grades Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShoppingCart className="h-4 w-4" />
              <span>Grades demandés ({selectedCourses.length})</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between text-sm bg-background/50 rounded-lg p-2"
                >
                  <span className="truncate flex-1 mr-2">{course.name}</span>
                  <span className="font-semibold text-primary">
                    {course.price} MAD
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Package className="h-4 w-4" />
              <span>Récapitulatif</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{pendingDemande.totalPrice.toFixed(2)} MAD</span>
              </div>
              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {pendingDemande.totalPrice.toFixed(2)} MAD
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Pour procéder au paiement</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href="mailto:formation@compliance-academy.ma"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    formation@compliance-academy.ma
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <a
                    href="tel:+212661234567"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    +212 6 61 23 45 67
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={selectedCourses.length === 0}
            onClick={handleOpenDialog}
          >
            <Edit className="h-4 w-4" />
            Modifier ma Demande
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full gap-2" size="lg" variant="destructive">
                <X className="h-4 w-4" />
                Annuler ma Demande
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Annuler ma Demande</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir annuler votre demande ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleCancelDemande(pendingDemande.id)}
                  className="bg-red-500 text-white hover:bg-red-700"
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <p className="text-xs text-center text-muted-foreground">
            Vous pouvez ajouter ou retirer des grades de votre demande avant
            l&apos;approbation.
          </p>
        </CardContent>

        {/* Modify Demande Dialog */}
        {pendingDemande.id && (
          <ModifyDemandeDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            demandeId={pendingDemande.id}
            currentGrades={selectedCourses}
            availableGrades={availableGrades}
            userGrades={userGrades}
            onSuccess={handleSuccess}
          />
        )}
      </Card>
    );
  }

  // If no pending demande, show the create new demande form
  return (
    <CreateNewDemandeForm
      availableGrades={availableGrades}
      userId={userId}
      userGrades={userGrades}
    />
  );
}

// Separate component for creating new demande
function CreateNewDemandeForm({
  availableGrades,
  userId,
  userGrades = [],
}: {
  availableGrades: Grade[];
  userId: string;
  userGrades: { id: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedGradeIds, setSelectedGradeIds] = useState<Set<string>>(
    new Set(),
  );

  // Filter out grades that the user already has
  const userGradeIds = new Set(userGrades.map((g) => g.id));
  const filteredAvailableGrades = availableGrades.filter(
    (grade) => !userGradeIds.has(grade.id),
  );

  const handleToggleGrade = (gradeId: string) => {
    setSelectedGradeIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(gradeId)) {
        newSet.delete(gradeId);
      } else {
        newSet.add(gradeId);
      }
      return newSet;
    });
  };

  const selectedGrades = filteredAvailableGrades.filter((g) =>
    selectedGradeIds.has(g.id),
  );
  const totalPrice = selectedGrades.reduce((sum, g) => sum + g.price, 0);

  const handleSubmit = () => {
    if (selectedGradeIds.size === 0) {
      toast.error("Veuillez sélectionner au moins un grade");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createNewDemande(
          userId,
          Array.from(selectedGradeIds),
        );

        if (result.success) {
          toast.success("Votre demande a été créée avec succès!");
          setSelectedGradeIds(new Set());
          router.refresh();
        } else {
          toast.error(result.error || "Une erreur s'est produite");
        }
      } catch (error) {
        toast.error(
          "Une erreur s'est produite lors de la création de la demande",
        );
      }
    });
  };

  return (
    <Card className="border-primary/20 bg-white sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">
              Nouvelle Formation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sélectionnez vos grades et créez une demande
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Grades Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Plus className="h-4 w-4" />
            <span>Grades Disponibles</span>
          </div>

          {filteredAvailableGrades.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-2">
              {userGrades.length > 0
                ? "Vous avez déjà tous les grades disponibles"
                : "Aucun grade disponible pour le moment"}
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredAvailableGrades.map((grade) => {
                const isSelected = selectedGradeIds.has(grade.id);

                return (
                  <div
                    key={grade.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                    onClick={() => handleToggleGrade(grade.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`grade-${grade.id}`}
                        checked={isSelected}
                        onChange={() => handleToggleGrade(grade.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`grade-${grade.id}`}
                        className="cursor-pointer"
                      >
                        <span className="font-medium">{grade.name}</span>
                      </label>
                    </div>
                    <span className="font-semibold text-primary text-sm">
                      {grade.price} MAD
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Selected Grades Summary */}
        {selectedGradeIds.size > 0 && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span>Grades sélectionnés ({selectedGradeIds.size})</span>
              </div>

              <div className="space-y-2">
                {selectedGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between text-sm bg-background/50 rounded-lg p-2"
                  >
                    <span className="truncate flex-1 mr-2">{grade.name}</span>
                    <span className="font-semibold text-primary">
                      {grade.price} MAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="h-4 w-4" />
            <span>Récapitulatif</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{totalPrice.toFixed(2)} MAD</span>
            </div>
            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{totalPrice.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Pour procéder au paiement</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href="mailto:formation@compliance-academy.ma"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  formation@compliance-academy.ma
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <a
                  href="tel:+212661234567"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  +212 6 61 23 45 67
                </a>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          disabled={selectedGradeIds.size === 0 || isPending}
          onClick={handleSubmit}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Créer ma Demande
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Une fois votre demande créée, vous pourrez la modifier avant son
          approbation.
        </p>
      </CardContent>
    </Card>
  );
}
