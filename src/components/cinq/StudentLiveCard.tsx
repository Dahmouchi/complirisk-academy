"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Users,
  Clock,
  CalendarDays,
  User,
  PlayCircle,
  Image as ImageIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { registerForLive, unregisterFromLive } from "@/actions/live-room";
import { toast } from "react-toastify";
import Image from "next/image";

interface StudentLiveCardProps {
  room: any;
  isRegistered?: boolean;
  userId: string;
}

export function StudentLiveCard({
  room,
  isRegistered,
  userId,
}: StudentLiveCardProps) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await registerForLive(room.id, userId);
      if (result.success) {
        setRegistered(true);
        toast.success("Inscription confirmée");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      const result = await unregisterFromLive(room.id, userId);
      if (result.success) {
        setRegistered(false);
        toast.info("Désinscription effectuée");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erreur lors de la désinscription");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    router.push(`/dashboard/live/${room.id}`);
  };

  const getStatusConfig = () => {
    switch (room.status) {
      case "LIVE":
        return {
          label: "En Direct",
          color: "bg-red-500 hover:bg-red-600",
          icon: "live",
        };
      case "SCHEDULED":
        return {
          label: "Programmé",
          color: "bg-blue-500 hover:bg-blue-600",
          icon: "scheduled",
        };
      case "ENDED":
        return {
          label: "Terminé",
          color: "bg-gray-500 hover:bg-gray-600",
          icon: "ended",
        };
      default:
        return {
          label: "Brouillon",
          color: "bg-gray-400 hover:bg-gray-500",
          icon: "draft",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const teacherName = `${room.teacher.prenom || ""} ${
    room.teacher.name || ""
  }`.trim();
  const initials = `${room.teacher.prenom?.[0] || ""}${
    room.teacher.name?.[0] || ""
  }`;
  const participantCount = room._count?.participants || 0;

  return (
    <Card className="group py-0 hover:shadow-xl transition-all duration-300 border overflow-hidden hover:scale-[1.02]">
      {/* Image Cover with Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-center p-4">
              <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground/70">Aucune image</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        {/* Status Badge on Image */}
        <div className="absolute top-3 left-3">
          <Badge className={`${statusConfig.color} backdrop-blur-sm`}>
            {room.status === "LIVE" && (
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
            )}
            {statusConfig.label}
          </Badge>
        </div>

        {/* Teacher Avatar on Image */}
        <div className="absolute top-3 right-3">
          <Avatar className="h-10 w-10 border-2 border-background shadow-md">
            <AvatarImage src={room.teacher.image} />
            <AvatarFallback className="text-sm bg-background/80 backdrop-blur-sm">
              {initials || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Subject Badge on Image */}
        {room.subject?.name && (
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="backdrop-blur-sm bg-background/60"
            >
              {room.subject.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Below Image */}
      <div className="p-4 space-y-4">
        {/* Room Title */}
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {room.name}
          </h3>
          {room.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {room.description}
            </p>
          )}
        </div>

        {/* Time and Duration Info */}
        <div className="space-y-2">
          {room.startsAt && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium">
                  {format(new Date(room.startsAt), "PPP", { locale: fr })}
                </span>
                <span className="text-muted-foreground ml-2">
                  à {format(new Date(room.startsAt), "HH:mm")}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            {room.duration ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{room.duration} minutes</span>
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{participantCount}</span>
              <span className="text-muted-foreground">
                / {room.maxParticipants || "∞"}
              </span>
            </div>
          </div>

          {/* Countdown for Scheduled Rooms */}
          {room.status === "SCHEDULED" && room.startsAt && (
            <div className="p-3 bg-primary/5 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1 text-center">
                Commence dans
              </p>
              <p className="font-semibold text-primary text-center">
                {formatDistanceToNow(new Date(room.startsAt), {
                  locale: fr,
                  addSuffix: false,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {room.status === "LIVE" ? (
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              onClick={handleJoin}
            >
              <PlayCircle className="h-5 w-5" />
              Rejoindre le live
            </Button>
          ) : room.status === "SCHEDULED" ? (
            <div className="flex gap-2">
              {registered ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleUnregister}
                    disabled={loading}
                  >
                    Se désinscrire
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/live/${room.id}`)}
                    title="Voir détails"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "..." : "S'inscrire"}
                </Button>
              )}
            </div>
          ) : room.status === "ENDED" ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/dashboard/live/${room.id}/replay`)}
              >
                Voir le replay
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/dashboard/live/${room.id}`)}
                title="Voir détails"
              >
                <Video className="h-5 w-5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
