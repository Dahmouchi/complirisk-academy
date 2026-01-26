"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Timer,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { registerForLive, unregisterFromLive } from "@/actions/live-room";
import { toast } from "react-toastify";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StudentLiveCardProps {
  isProgrammed?: boolean;
  room: any;
  isRegistered?: boolean;
  userId: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function StudentLiveCardWithTiming({
  isProgrammed,
  room,
  isRegistered,
  userId,
}: StudentLiveCardProps) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null,
  );
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    if (room.status === "SCHEDULED" && room.startsAt) {
      const calculateTimeRemaining = () => {
        const now = new Date().getTime();
        const startTime = new Date(room.startsAt).getTime();
        const difference = startTime - now;

        if (difference > 0) {
          return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
        return null;
      };

      // Initial calculation
      setTimeRemaining(calculateTimeRemaining());

      // Update every second
      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimeRemaining(remaining);

        // If countdown is finished, refresh the page to update status
        if (!remaining) {
          clearInterval(timer);
          router.refresh();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [room.status, room.startsAt, router]);

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

  // Get background gradient based on status
  const getCardGradient = () => {
    switch (room.status) {
      case "LIVE":
        return "bg-gradient-to-br from-red-50/50 via-white to-red-50/30 dark:from-red-950/20 dark:via-background dark:to-red-950/10";
      case "SCHEDULED":
        return "bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10";
      default:
        return "bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 dark:from-gray-950/20 dark:via-background dark:to-gray-950/10";
    }
  };
  const subjectColor = room.subject?.color || "#3B82F6";
  return (
    <Card
      className={cn(
        "overflow-hidden relative rounded-3xl py-0 border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] animate-fade-in",
        getCardGradient(),
      )}
      style={{
        backgroundImage: `url(${room.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute z-0 inset-0 bg-black/50"></div>
      <CardContent className="py-4 space-y-5 relative z-10">
        {/* Header with Teacher Info and Status */}
        <div className="flex items-start justify-between flex-col lg:flex-row">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary/20 ring-2 ring-primary/10">
              <AvatarImage src={room.teacher.image} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                {room.teacher.prenom[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h4 className="font-semibold text-base">
                {room.teacher.prenom} {room.teacher.name}
              </h4>
              <p className="text-xs flex items-center gap-1">
                <User className="h-3 w-3" />
                Instructeur
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="lg:mt-0 mt-2">
            {room.status === "LIVE" && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                <span className="w-2 h-2 bg-white rounded-full" />
                EN DIRECT
              </div>
            )}

            {room.status === "SCHEDULED" && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Clock className="h-3 w-3" />
                PROGRAMMÉ
              </div>
            )}
            {room.startsAt && (
              <div className="pt-2 text-white">
                <div className="flex-1 min-w-0">
                  <div className="text-xs">
                    {format(new Date(room.startsAt), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Title and Description */}
        <div className="flex lg:items-center lg:justify-between lg:flex-row flex-col">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-white leading-tight line-clamp-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {room.name}
            </h3>
            {room.description && (
              <p className="text-sm text-gray-100 line-clamp-2 leading-relaxed">
                {room.description}
              </p>
            )}
          </div>
          {room.status === "SCHEDULED" && timeRemaining && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                {/* Days */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-2 text-center border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:border-primary/40">
                    <div className="text-xl font-black bg-white bg-clip-text text-transparent">
                      {String(timeRemaining.days).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-semibold text-white uppercase mt-1">
                      Jours
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-2 text-center border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:border-primary/40">
                    <div className="text-xl font-black bg-white bg-clip-text text-transparent">
                      {String(timeRemaining.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-semibold text-white uppercase mt-1">
                      Heures
                    </div>
                  </div>
                </div>

                {/* Minutes */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-2 text-center border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:border-primary/40">
                    <div className="text-xl font-black bg-white bg-clip-text text-transparent">
                      {String(timeRemaining.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-semibold text-white uppercase mt-1">
                      Min
                    </div>
                  </div>
                </div>

                {/* Seconds */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-2 text-center border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:border-primary/40">
                    <div className="text-xl font-black bg-white bg-clip-text text-transparent">
                      {String(timeRemaining.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-semibold text-white uppercase mt-1">
                      Sec
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date and Time */}

        {/* Countdown Timer for Scheduled Sessions */}

        {/* Action Buttons */}
        <div className="pt-2">
          {room.status === "LIVE" ? (
            <Button
              size="lg"
              className="w-full gap-2 rounded-[8px] bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={handleJoin}
            >
              <PlayCircle className="h-5 w-5" />
              Rejoindre le live maintenant
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </Button>
          ) : room.status === "SCHEDULED" ? (
            <div className="flex gap-3">
              {registered ? (
                <Button
                  onClick={handleUnregister}
                  disabled={loading}
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-[8px] font-semibold border-2 h-12",
                    "border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20",
                    "transition-all duration-300",
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4 mr-2" />
                  )}
                  Se désinscrire
                </Button>
              ) : (
                <Button
                  className={cn(
                    "flex-1 rounded-[8px] font-bold h-12",
                    "shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
                    "text-white",
                  )}
                  style={{ backgroundColor: subjectColor }}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      S&apos;inscrire au live
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : room.status === "ENDED" ? (
            <div className="flex gap-3">
              {room.recordingStatus === "COMPLETED" ? (
                <>
                  <Button
                    variant="default"
                    className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    onClick={() =>
                      router.push(`/dashboard/live/${room.id}/replay`)
                    }
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Voir le replay
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl h-12 w-12"
                    onClick={() => router.push(`/dashboard/live/${room.id}`)}
                    title="Voir détails"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="flex-1 rounded-2xl h-12"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
