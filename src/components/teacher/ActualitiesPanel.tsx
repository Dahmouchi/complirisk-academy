"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

interface News {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  grades: {
    grade: {
      name: string;
    };
  }[];
}

interface ActualitiesPanelProps {
  userId: string;
}

const ActualitiesPanel = ({ userId }: ActualitiesPanelProps) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const router = useRouter();

  useEffect(() => {
    fetchNews();
  }, [userId]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teacher/news?authorId=${userId}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (newsId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/teacher/news/${newsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: !currentStatus,
          publishedAt: !currentStatus ? new Date() : null,
        }),
      });

      if (response.ok) {
        toast.success(
          !currentStatus
            ? "Actualité publiée avec succès"
            : "Actualité dépubliée",
        );
        fetchNews();
      }
    } catch (error) {
      toast.error("Erreur lors de la modification");
      console.error(error);
    }
  };

  const deleteNews = async (newsId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/teacher/news/${newsId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Actualité supprimée");
        fetchNews();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      HIGH: { label: "Urgent", className: "bg-red-500" },
      MEDIUM: { label: "Normal", className: "bg-blue-500" },
      LOW: { label: "Info", className: "bg-gray-500" },
    };
    const priorityConfig =
      config[priority as keyof typeof config] || config.MEDIUM;
    return (
      <Badge className={priorityConfig.className}>{priorityConfig.label}</Badge>
    );
  };

  const filteredNews = news.filter((item) => {
    if (filter === "all") return true;
    if (filter === "published") return item.published;
    if (filter === "draft") return !item.published;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Actualités</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez les actualités pour vos étudiants
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/teacher/dashboard/actualites")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Actualité
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Toutes
          </Button>
          <Button
            variant={filter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("published")}
            className="gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Publiées
          </Button>
          <Button
            variant={filter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("draft")}
            className="gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            Brouillons
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Aucune actualité trouvée
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez votre première actualité pour informer vos étudiants
            </p>
            <Button
              onClick={() => router.push("/teacher/dashboard/actualites")}
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer une actualité
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityBadge(item.priority)}
                      {item.published ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Publiée
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Brouillon
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.createdAt), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}

                    {item.grades.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">
                          Visible par:
                        </span>
                        {item.grades.map((g, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {g.grade.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2"
                      onClick={() => togglePublish(item.id, item.published)}
                      title={item.published ? "Dépublier" : "Publier"}
                    >
                      {item.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2"
                      onClick={() =>
                        router.push(
                          `/teacher/dashboard/actualites/${item.id}/edit`,
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => deleteNews(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActualitiesPanel;
