"use client";

import { useEffect, useState } from "react";
import { Loader2, Video } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Users, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LiveRoom {
  id: string;
  name: string;
  description?: string;
  startsAt?: string;
  status: "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
  teacher: {
    name: string;
    prenom: string;
    image?: string;
  };
  subject?: {
    name: string;
    color: string;
  };
  _count?: {
    participants: number;
  };
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(59, 130, 246, ${alpha})`; // fallback to blue

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LivePanel = ({
  registeredUser,
  userId,
}: {
  registeredUser: any;
  userId?: string;
}) => {
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLiveRooms();
  }, []);

  const fetchLiveRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/live-rooms/upcoming");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des lives");
      }
      const data = await response.json();
      setLiveRooms(data);
    } catch (err) {
      console.error("Error fetching live rooms:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleLiveClick = (liveId: string) => {
    router.push(`/dashboard/live/${liveId}`);
  };

  // Group lives by status
  const liveLives = liveRooms.filter((room) => room.status === "LIVE");
  const scheduledLives = liveRooms.filter(
    (room) => room.status === "SCHEDULED",
  );

  return (
    <div className="bg-card rounded-3xl p-6 card-shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Video className="h-5 w-5" />
        Mes Lives
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
        ) : liveRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              Aucun live disponible pour le moment
            </p>
          </div>
        ) : (
          <>
            {/* Live Sessions */}
            {liveLives.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  En Direct
                </h3>
                {liveLives.map((live) => {
                  const subjectColor = live.subject?.color || "#3B82F6";
                  const participantCount = live._count?.participants || 0;

                  return (
                    <div
                      key={live.id}
                      onClick={() => handleLiveClick(live.id)}
                      className="relative overflow-hidden rounded-2xl p-4 border-2 border-red-500 shadow-red-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: `linear-gradient(to bottom right, ${hexToRgba(subjectColor, 0.2)}, ${hexToRgba(subjectColor, 0.05)})`,
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={live.teacher.image} />
                            <AvatarFallback className="text-xs bg-primary text-white">
                              {live.teacher.prenom?.[0]}
                              {live.teacher.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {live.teacher.prenom} {live.teacher.name}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="destructive"
                          className="animate-pulse text-[10px] px-2 py-0.5"
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full mr-1" />
                          LIVE
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm line-clamp-2 mb-2">
                        {live.name}
                      </h3>

                      {/* Subject Badge */}
                      {live.subject && (
                        <div className="mb-3">
                          <Badge
                            className="text-xs font-semibold text-white"
                            style={{ backgroundColor: subjectColor }}
                          >
                            {live.subject.name}
                          </Badge>
                        </div>
                      )}

                      {/* Participants */}
                      {participantCount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span className="font-medium">
                            {participantCount}
                          </span>
                          <span>inscrit{participantCount > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Scheduled Sessions */}
            {scheduledLives.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  À venir
                </h3>
                {scheduledLives.map((live) => {
                  const subjectColor = live.subject?.color || "#3B82F6";

                  return (
                    <div
                      key={live.id}
                      onClick={() => handleLiveClick(live.id)}
                      className="relative overflow-hidden rounded-2xl p-4 border-2 transition-all duration-300 hover:shadow-lg  cursor-pointer"
                      style={{
                        background: `linear-gradient(to bottom right, ${hexToRgba(subjectColor, 0.15)}, ${hexToRgba(subjectColor, 0.03)})`,
                        borderColor: hexToRgba(subjectColor, 0.3),
                      }}
                    >
                      {/* Header */}

                      {/* Title */}
                      <h3 className="font-bold text-sm line-clamp-2 mb-2">
                        {live.name}
                      </h3>

                      {/* Subject Badge */}
                      {live.subject && (
                        <div className="mb-3">
                          <Badge
                            className="text-xs font-semibold text-white rounded-full"
                            style={{ backgroundColor: subjectColor }}
                          >
                            {live.subject.name}
                          </Badge>
                        </div>
                      )}

                      {/* Date and Time */}
                      {live.startsAt && (
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span className="font-medium">
                              {format(new Date(live.startsAt), "d MMMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(live.startsAt), "HH:mm")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LivePanel;
