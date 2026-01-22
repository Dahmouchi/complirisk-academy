"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface Grade {
  id: string;
  name: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  priority: string;
  published: boolean;
  grades: {
    gradeId: string;
    grade: {
      id: string;
      name: string;
    };
  }[];
}

const EditNewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(true);
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
    fetchNews();
  }, [newsId]);

  const fetchNews = async () => {
    try {
      setFetchingNews(true);
      const response = await fetch(`/api/news/${newsId}`);
      if (response.ok) {
        const news: News = await response.json();
        setFormData({
          title: news.title,
          content: news.content,
          excerpt: news.excerpt || "",
          imageUrl: news.imageUrl || "",
          priority: news.priority,
          published: news.published,
          gradeIds: news.grades.map((g) => g.gradeId),
        });
      } else {
        toast.error("Actualité non trouvée");
        router.push("/teacher/dashboard");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setFetchingNews(false);
    }
  };

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
      // First update the news basic info
      const updateResponse = await fetch(`/api/news/${newsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          imageUrl: formData.imageUrl,
          priority: formData.priority,
          published: publish,
          publishedAt: publish ? new Date() : null,
        }),
      });

      if (updateResponse.ok) {
        // Then update grades - delete all and recreate
        await fetch(`/api/news/${newsId}/grades`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gradeIds: formData.gradeIds }),
        });

        toast.success("Actualité mise à jour avec succès");
        router.push("/teacher/dashboard");
      } else {
        const error = await updateResponse.json();
        toast.error(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Erreur lors de la mise à jour de l'actualité");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingNews) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">Modifier l'Actualité</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'actualité</CardTitle>
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
              <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
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
                {loading ? "Mise à jour..." : "Publier"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditNewsPage;
