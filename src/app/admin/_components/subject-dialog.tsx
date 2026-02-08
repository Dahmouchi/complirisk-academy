"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grade, Subject } from "@/types/menu";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
  grades: Grade[];
  onSave: (data: {
    name: string;
    color: string;
    handler: string;
    gradeId: string;
    description: string;
  }) => void;
}

// Couleurs prédéfinies pour les matières
const predefinedColors = [
  "#3B82F6", // Bleu
  "#EF4444", // Rouge
  "#10B981", // Vert
  "#8B5CF6", // Violet
  "#F59E0B", // Orange
  "#6366F1", // Indigo
  "#EC4899", // Rose
  "#14B8A6", // Teal
  "#F97316", // Orange foncé
  "#84CC16", // Lime
  "#6B7280", // Gris
  "#DC2626", // Rouge foncé
];

export default function SubjectDialog({
  open,
  onOpenChange,
  subject,
  grades,
  onSave,
}: SubjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [handler, setHandler] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [gradeId, setGradeId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setColor(subject.color);
      setHandler(subject.handler);
      setGradeId(subject.gradeId);
      setDescription(subject.description);
    } else {
      setName("");
      setColor("#3B82F6");
      setHandler("");
      setGradeId("");
      setDescription("");
    }
  }, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !gradeId) {
      return;
    }

    setLoading(true);

    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({ name: name.trim(), color, handler, gradeId, description });
    setLoading(false);
    setName("");
    setHandler("");
    setColor("#3B82F6");
    setGradeId("");
    setDescription("");
  };

  const handleCancel = () => {
    setName("");
    setColor("#3B82F6");
    setGradeId("");
    setHandler("");
    setDescription("");
    onOpenChange(false);
  };

  const isValid = name.trim() && gradeId;

  // Grouper les classes par niveau
  const gradesByNiveau = grades.reduce(
    (acc, grade) => {
      const niveauName = grade.niveau.name;
      if (!acc[niveauName]) {
        acc[niveauName] = [];
      }
      acc[niveauName].push(grade);
      return acc;
    },
    {} as Record<string, Grade[]>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {subject ? "Modifier la section" : "Créer une nouvelle section"}
            </DialogTitle>
            <DialogDescription>
              {subject
                ? "Modifiez les informations de la section."
                : "Créez une nouvelle section pour une norme."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Titre *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mathématiques, Français..."
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description *
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Mathématiques..."
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Hndler (URL) *
              </Label>
              <Input
                id="handler"
                value={handler}
                onChange={(e) => setHandler(e.target.value)}
                placeholder="Ex: mathematiques-1bac..."
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Norme *
              </Label>
              <Select value={gradeId} onValueChange={setGradeId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une norme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(gradesByNiveau).map(
                    ([niveauName, niveauGrades]) => (
                      <div key={niveauName}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                          {niveauName}
                        </div>
                        {niveauGrades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </div>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Couleur *</Label>
              <div className="col-span-3 space-y-3">
                {/* Couleur personnalisée */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 font-mono"
                  />
                </div>

                {/* Couleurs prédéfinies */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Couleurs prédéfinies :
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {predefinedColors.map((predefinedColor) => (
                      <button
                        key={predefinedColor}
                        type="button"
                        onClick={() => setColor(predefinedColor)}
                        className={`w-8 h-8 rounded border-2 cursor-pointer transition-all ${
                          color === predefinedColor
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: predefinedColor }}
                        title={predefinedColor}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !isValid}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {subject ? "Modification..." : "Création..."}
                </div>
              ) : subject ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
