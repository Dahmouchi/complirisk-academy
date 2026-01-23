"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Grade {
  id: string;
  name: string;
}

const CreateNewsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    priority: "MEDIUM",
    published: false,
    gradeIds: [] as string[],
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch("/api/grades");
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const handleGradeToggle = (gradeId: string) => {
    setFormData((prev) => ({
      ...prev,
      gradeIds: prev.gradeIds.includes(gradeId)
        ? prev.gradeIds.filter((id) => id !== gradeId)
        : [...prev.gradeIds, gradeId],
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    if (!formData.title || !formData.content) {
      toast.error("Le titre et le contenu sont requis");
      return;
    }

    if (formData.gradeIds.length === 0) {
      toast.error("Veuillez sélectionner au moins une classe");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish,
        }),
      });

      if (response.ok) {
        toast.success(
          publish
            ? "Actualité publiée avec succès"
            : "Brouillon enregistré avec succès",
        );
        router.push("/teacher/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("Erreur lors de la création de l'actualité");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Nouvelle Actualité</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l&apos;actualité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Entrez le titre de l'actualité"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Résumé</Label>
              <Input
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Court résumé pour l'aperçu"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Contenu complet de l'actualité"
                rows={8}
                className="resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Info</SelectItem>
                  <SelectItem value="MEDIUM">Normal</SelectItem>
                  <SelectItem value="HIGH">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grades Selection */}
            <div className="space-y-2">
              <Label>Classes visées *</Label>
              <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                {grades.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Chargement des classes...
                  </p>
                ) : (
                  grades.map((grade) => (
                    <div key={grade.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={grade.id}
                        checked={formData.gradeIds.includes(grade.id)}
                        onCheckedChange={() => handleGradeToggle(grade.id)}
                      />
                      <Label
                        htmlFor={grade.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {grade.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Sélectionnez les classes qui verront cette actualité
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleSubmit(false)}
                variant="outline"
                className="gap-2"
                disabled={loading}
              >
                <Save className="h-4 w-4" />
                Enregistrer comme brouillon
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                className="gap-2"
                disabled={loading}
              >
                <Eye className="h-4 w-4" />
                {loading ? "Publication..." : "Publier maintenant"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNewsPage;
