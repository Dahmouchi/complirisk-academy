"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Loader2 } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  published: boolean;
  author: {
    id: string;
    name: string;
    image: string;
    prenom: string;
    role: string;
  };
  publishedAt: string | null;
  createdAt: string;
}

const EventsPanel = ({ registeredUser }: any) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des actualités");
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Map news priority to event type
  const getEventType = (priority: string): "webinar" | "lesson" | "task" => {
    switch (priority) {
      case "HIGH":
        return "webinar";
      case "MEDIUM":
        return "lesson";
      default:
        return "task";
    }
  };

  // Map priority to variant color
  const getVariant = (
    index: number,
  ): "mint" | "lavender" | "cream" | "card" => {
    const variants = ["card", "lavender", "cream", "mint"] as const;
    return variants[index % variants.length];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];

    return `${dayName}, ${day}.${month}`;
  };

  return (
    <div className="bg-card rounded-[6px] p-6 card-shadow  flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Mes événements 🤓
      </h2>

      <div className="space-y-4 flex-1 overflow-auto pr-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              Aucune actualité disponible pour le moment
            </p>
          </div>
        ) : (
          news.map((item, index) => (
            <EventCard
              key={item.id}
              type={getEventType(item.priority)}
              title={item.title}
              author={item.author.name}
              image={item.author.image}
              role={item.author.role}
              description={item.excerpt || item.content}
              date={formatDate(item.publishedAt || item.createdAt)}
              variant={getVariant(index)}
              isLocked={!registeredUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPanel;
