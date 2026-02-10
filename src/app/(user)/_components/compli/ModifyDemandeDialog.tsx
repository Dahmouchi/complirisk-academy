"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, ShoppingCart } from "lucide-react";
import { updateDemandeGrades } from "@/app/(user)/_actions/updateDemandeGrades";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";

interface Grade {
  id: string;
  name: string;
  price: number;
}

interface ModifyDemandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demandeId: string;
  currentGrades: Grade[];
  availableGrades: Grade[];
  userGrades?: { id: string }[];
  onSuccess?: () => void;
}

export function ModifyDemandeDialog({
  open,
  onOpenChange,
  demandeId,
  currentGrades,
  availableGrades,
  userGrades = [],
  onSuccess,
}: ModifyDemandeDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedGradeIds, setSelectedGradeIds] = useState<Set<string>>(
    new Set(currentGrades.map((g) => g.id)),
  );

  const handleToggleGrade = (gradeId: string) => {
    // Prevent toggling if user already has this grade
    if (userGrades.some((g) => g.id === gradeId)) return;

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

  const selectedGrades = availableGrades.filter((g) =>
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
        const result = await updateDemandeGrades(
          demandeId,
          Array.from(selectedGradeIds),
        );

        if (result.success) {
          toast.success("Votre demande a été mise à jour avec succès");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Une erreur s'est produite");
        }
      } catch (error) {
        toast.error("Une erreur s'est produite lors de la mise à jour");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Modifier votre Demande
          </DialogTitle>
          <DialogDescription>
            Sélectionnez ou désélectionnez les grades pour votre formation. Vous
            pouvez ajouter ou retirer des grades selon vos besoins.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Available Grades with Searchable Dropdown */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              Sélectionner les Grades
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto min-h-[44px] px-3 py-2"
                >
                  <div className="flex flex-wrap gap-1 items-center">
                    {selectedGradeIds.size > 0 ? (
                      selectedGrades.map((grade) => (
                        <Badge
                          key={grade.id}
                          variant="secondary"
                          className="mr-1 mb-1"
                        >
                          {grade.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        Rechercher des grades...
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command className="w-full">
                  <CommandInput placeholder="Rechercher un grade..." />
                  <CommandList>
                    <CommandEmpty>Aucun grade trouvé.</CommandEmpty>
                    <CommandGroup>
                      {availableGrades.map((grade) => {
                        const isSelected = selectedGradeIds.has(grade.id);
                        const isOwned = userGrades.some(
                          (g) => g.id === grade.id,
                        );
                        const wasOriginallySelected = currentGrades.some(
                          (g) => g.id === grade.id,
                        );

                        return (
                          <CommandItem
                            key={grade.id}
                            value={grade.name}
                            onSelect={() =>
                              !isOwned && handleToggleGrade(grade.id)
                            }
                            disabled={isOwned}
                            className={cn(
                              "flex items-center justify-between py-3 cursor-pointer",
                              isOwned && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected || isOwned
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible",
                                  isOwned && "bg-muted border-muted",
                                )}
                              >
                                {isOwned ? (
                                  <Check className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {grade.name}
                                  </span>
                                  {isOwned && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] h-4 px-1 bg-success/10 text-success border-success/20"
                                    >
                                      Déjà possédé
                                    </Badge>
                                  )}
                                </div>
                                {wasOriginallySelected && !isOwned && (
                                  <span className="text-[10px] text-muted-foreground">
                                    Actuellement dans la demande
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-primary">
                              {grade.price} MAD
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-foreground">
              Récapitulatif
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Grades sélectionnés
                </span>
                <span className="font-medium">{selectedGradeIds.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prix total</span>
                <span className="font-bold text-primary text-lg">
                  {totalPrice.toFixed(2)} MAD
                </span>
              </div>
            </div>

            {selectedGradeIds.size > 0 && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Grades sélectionnés:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGrades.map((grade) => (
                    <Badge key={grade.id} variant="outline">
                      {grade.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedGradeIds.size === 0}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Mettre à jour la demande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
