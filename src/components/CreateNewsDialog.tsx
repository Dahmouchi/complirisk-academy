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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface Grade {
  id: string;
  name: string;
}

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  published: boolean;
  gradeIds: string[];
}

interface CreateNewsDialogProps {
  onNewsCreated?: () => void;
  grades: Grade[];
}

export function CreateNewsDialog({
  onNewsCreated,
  grades,
}: CreateNewsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    priority: "MEDIUM",
    published: false,
    gradeIds: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Le contenu est requis");
      return;
    }

    if (formData.gradeIds.length === 0) {
      toast.error("Sélectionnez au moins une classe");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      toast.success("Actualité créée avec succès");
      setOpen(false);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        imageUrl: "",
        priority: "MEDIUM",
        published: false,
        gradeIds: [],
      });
      onNewsCreated?.();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const toggleGrade = (gradeId: string) => {
    setFormData((prev) => ({
      ...prev,
      gradeIds: prev.gradeIds.includes(gradeId)
        ? prev.gradeIds.filter((id) => id !== gradeId)
        : [...prev.gradeIds, gradeId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Actualité
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle actualité</DialogTitle>
          <DialogDescription>
            Partagez une actualité ou un événement avec les étudiants
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Titre de l'actualité"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Résumé (optionnel)</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Court résumé pour l'aperçu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Contenu complet de l'actualité"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">Haute</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="LOW">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Classes concernées *</Label>
            <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
              {grades.map((grade) => (
                <div key={grade.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade.id}`}
                    checked={formData.gradeIds.includes(grade.id)}
                    onCheckedChange={() => toggleGrade(grade.id)}
                  />
                  <label
                    htmlFor={`grade-${grade.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {grade.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked as boolean })
              }
            />
            <label
              htmlFor="published"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Publier immédiatement
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
