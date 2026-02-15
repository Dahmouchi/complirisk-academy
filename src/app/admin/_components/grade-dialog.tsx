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
import { Grade, Niveau, Formateur } from "@/types/menu";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade | null;
  niveaux: Niveau[];
  formateurs: Formateur[];
  onSave: (data: {
    name: string;
    niveauId: string;
    price: number;
    formateurId?: string;
    documents?: File;
  }) => void;
}

export default function GradeDialog({
  open,
  onOpenChange,
  grade,
  niveaux,
  formateurs,
  onSave,
}: GradeDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [niveauId, setNiveauId] = useState("");
  const [formateurId, setFormateurId] = useState<string>("");
  const [documents, setDocuments] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grade) {
      setName(grade.name);
      setNiveauId(grade.niveauId);
      setFormateurId(grade.formateurId || "");
      setPrice(grade.price);
      setDocuments(null); // Reset file input when editing
    } else {
      setName("");
      setNiveauId("");
      setFormateurId("");
      setDocuments(null);
    }
  }, [grade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);

    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      name: name.trim(),
      niveauId,
      price,
      formateurId: formateurId || undefined,
      documents: documents || undefined,
    });
    setLoading(false);
    setName("");
    setPrice(0);
    setNiveauId("");
    setFormateurId("");
    setDocuments(null);
  };

  const handleCancel = () => {
    setName("");
    setPrice(0);
    setNiveauId("");
    setFormateurId("");
    setDocuments(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {grade ? "Modifier la norme" : "Créer une nouvelle norme"}
            </DialogTitle>
            <DialogDescription>
              {grade
                ? "Modifiez les informations de la norme."
                : "Créez une nouvelle norme pour un niveau d'éducation."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: ISO 37001, ISO 27001..."
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix *
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Ex: 10000"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formateur" className="text-right">
                Formateur
              </Label>
              <Select value={formateurId} onValueChange={setFormateurId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un formateur (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun formateur</SelectItem>
                  {formateurs.map((formateur) => (
                    <SelectItem key={formateur.id} value={formateur.id}>
                      {formateur.fullName} - {formateur.specialite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documents" className="text-right">
                Documents
              </Label>
              <Input
                id="documents"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setDocuments(e.target.files?.[0] || null)}
                className="col-span-3"
              />
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {grade ? "Modification..." : "Création..."}
                </div>
              ) : grade ? (
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
