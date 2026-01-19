"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Megaphone, Calendar, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  publishedAt: string;
  author: {
    id: string;
    name?: string;
    prenom?: string;
    role: string;
  };
  grades: Array<{
    grade: {
      id: string;
      name: string;
    };
  }>;
}

export function NewsView() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNewsDetail = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-orange-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "Urgent";
      case "MEDIUM":
        return "Important";
      case "LOW":
        return "Info";
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Megaphone className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Aucune actualité</h3>
        <p className="text-muted-foreground">
          Aucune actualité n&apos;est disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openNewsDetail(item)}
            >
              {item.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getPriorityColor(item.priority)}>
                    {getPriorityLabel(item.priority)}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(item.publishedAt), "d MMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                {item.excerpt && (
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>
                    {item.author.prenom || item.author.name || "Anonyme"}
                  </span>
                </div>
                <span className="text-xs">
                  {item.grades.map((g) => g.grade.name).join(", ")}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* News Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getPriorityColor(selectedNews.priority)}>
                    {getPriorityLabel(selectedNews.priority)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(selectedNews.publishedAt), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
                <DialogTitle className="text-2xl">
                  {selectedNews.title}
                </DialogTitle>
              </DialogHeader>
              {selectedNews.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{selectedNews.content}</p>
              </div>
              <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>
                    Publié par{" "}
                    <span className="font-medium">
                      {selectedNews.author.prenom ||
                        selectedNews.author.name ||
                        "Anonyme"}
                    </span>
                  </span>
                </div>
                <div>
                  Classes:{" "}
                  {selectedNews.grades.map((g) => g.grade.name).join(", ")}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
