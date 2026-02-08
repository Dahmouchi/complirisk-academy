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
import { Grade, Niveau } from "@/types/menu";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade | null;
  niveaux: Niveau[];
  onSave: (data: { name: string; niveauId: string; price: number }) => void;
}

export default function GradeDialog({
  open,
  onOpenChange,
  grade,
  niveaux,
  onSave,
}: GradeDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [niveauId, setNiveauId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grade) {
      setName(grade.name);
      setNiveauId(grade.niveauId);
    } else {
      setName("");
      setNiveauId("");
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

    onSave({ name: name.trim(), niveauId, price });
    setLoading(false);
    setName("");
    setPrice(0);
    setNiveauId("");
  };

  const handleCancel = () => {
    setName("");
    setPrice(0);
    setNiveauId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {grade ? "Modifier la classe" : "Créer une nouvelle classe"}
            </DialogTitle>
            <DialogDescription>
              {grade
                ? "Modifiez les informations de la classe."
                : "Créez une nouvelle classe pour un niveau d'éducation."}
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
                placeholder="Ex: CP, 6ème, 2nde..."
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
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Ex: 10000"
                className="col-span-3"
                required
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
