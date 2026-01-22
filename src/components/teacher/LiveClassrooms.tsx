"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Eye,
  Play,
  Plus,
  Radio,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LiveClassroom {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startsAt: Date | null;
  subject: {
    name: string;
    color: string;
  } | null;
  grade: {
    name: string;
  } | null;
  participants: {
    id: string;
  }[];
  recordingUrl: string | null;
}

interface LiveClassroomsProps {
  userId: string;
}

const LiveClassrooms = ({ userId }: LiveClassroomsProps) => {
  const [lives, setLives] = useState<LiveClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "scheduled" | "live" | "ended">(
    "all",
  );
  const router = useRouter();

  useEffect(() => {
    fetchLives();
  }, [userId]);

  const fetchLives = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teacher/lives?teacherId=${userId}`);
      const data = await response.json();
      setLives(data);
    } catch (error) {
      console.error("Error fetching lives:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      LIVE: { label: "En direct", className: "bg-red-500 animate-pulse" },
      SCHEDULED: { label: "Programmé", className: "bg-blue-500" },
      ENDED: { label: "Terminé", className: "bg-gray-500" },
      DRAFT: { label: "Brouillon", className: "bg-yellow-500" },
      CANCELLED: { label: "Annulé", className: "bg-orange-500" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-500",
    };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredLives = lives.filter((live) => {
    if (filter === "all") return true;
    return live.status === filter.toUpperCase();
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
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Classes en Direct</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez vos sessions en direct
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/teacher/dashboard/live")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Session
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Tous
          </Button>
          <Button
            variant={filter === "live" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("live")}
            className="gap-1"
          >
            <Radio className="h-3 w-3" />
            En direct
          </Button>
          <Button
            variant={filter === "scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("scheduled")}
          >
            Programmés
          </Button>
          <Button
            variant={filter === "ended" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ended")}
          >
            Terminés
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredLives.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Aucune session trouvée
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez votre première session en direct
            </p>
            <Button
              onClick={() => router.push("/teacher/dashboard/live")}
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer une session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLives.map((live) => (
              <div
                key={live.id}
                className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer hover:shadow-md"
                onClick={() => {
                  if (live.status === "LIVE") {
                    router.push(`/teacher/dashboard/live/${live.id}`);
                  } else if (live.status === "ENDED" && live.recordingUrl) {
                    router.push(`/teacher/dashboard/live/${live.id}/replay`);
                  } else {
                    router.push(`/teacher/dashboard/live/${live.id}`);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(live.status)}
                      {live.subject && (
                        <Badge
                          variant="outline"
                          style={{ borderColor: live.subject.color }}
                        >
                          {live.subject.name}
                        </Badge>
                      )}
                      {live.grade && (
                        <Badge variant="secondary">{live.grade.name}</Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{live.name}</h3>
                    {live.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {live.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      {live.startsAt && (
                        <>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(live.startsAt), "dd MMM yyyy", {
                              locale: fr,
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(live.startsAt), "HH:mm")}
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {live.participants.length} participant
                        {live.participants.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {live.status === "LIVE" && (
                      <Button
                        size="sm"
                        className="gap-2 bg-red-500 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/teacher/dashboard/live/${live.id}`);
                        }}
                      >
                        <Radio className="h-4 w-4 animate-pulse" />
                        Rejoindre
                      </Button>
                    )}
                    {live.status === "ENDED" && live.recordingUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/teacher/dashboard/live/${live.id}/replay`,
                          );
                        }}
                      >
                        <Play className="h-4 w-4" />
                        Replay
                      </Button>
                    )}
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

export default LiveClassrooms;
