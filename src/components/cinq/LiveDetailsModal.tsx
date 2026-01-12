"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Calendar,
  Clock,
  Users,
  BookOpen,
  User,
  Bell,
  BellOff,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerForLive, unregisterFromLive } from "@/actions/live-room";
import { toast } from "react-toastify";

interface LiveDetailsModalProps {
  event: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  isRegistered?: boolean;
}

export function LiveDetailsModal({
  event,
  open,
  onOpenChange,
  userId,
  isRegistered,
}: LiveDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const router = useRouter();

  if (!event) return null;

  const teacherName = `${event.teacher.prenom || ""} ${
    event.teacher.name || ""
  }`.trim();
  const initials = `${event.teacher.prenom?.[0] || ""}${
    event.teacher.name?.[0] || ""
  }`;

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await registerForLive(event.id, userId);
      if (result.success) {
        setRegistered(true);
        toast.info("Vous recevrez une notification avant le début du live");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Impossible de s'inscrire");
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      const result = await unregisterFromLive(event.id, userId);
      if (result.success) {
        setRegistered(false);
        toast.success("Désinscription réussie");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Impossible de se désinscrire");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    router.push(`/dashboard/live/${event.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{event.name}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {event.status === "LIVE" && (
                  <Badge className="bg-red-500">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    En Direct
                  </Badge>
                )}
                <Badge
                  style={{
                    backgroundColor: event.subject.color + "20",
                    color: event.subject.color,
                    borderColor: event.subject.color,
                  }}
                  variant="outline"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {event.subject.name}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          )}

          {/* Enseignant */}
          <div>
            <h4 className="font-semibold mb-3">Enseignant</h4>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={event.teacher.image} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{teacherName}</p>
                <p className="text-sm text-muted-foreground">
                  Professeur de {event.subject.name}
                </p>
              </div>
            </div>
          </div>

          {/* Détails */}
          <div>
            <h4 className="font-semibold mb-3">Détails</h4>
            <div className="space-y-3">
              {event.startsAt && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date et heure</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.startsAt), "PPPP 'à' HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {event.duration && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Durée</p>
                    <p className="text-sm text-muted-foreground">
                      {event.duration} minutes
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">
                    {event._count?.participants || 0} / {event.maxParticipants}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {event.status === "LIVE" ? (
              <Button className="flex-1 gap-2" onClick={handleJoin} size="lg">
                <Video className="h-5 w-5" />
                Rejoindre le Live
              </Button>
            ) : event.status === "SCHEDULED" ? (
              <>
                {registered ? (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleUnregister}
                    disabled={loading}
                    size="lg"
                  >
                    <BellOff className="h-5 w-5" />
                    Se désinscrire
                  </Button>
                ) : (
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleRegister}
                    disabled={loading}
                    size="lg"
                  >
                    <Bell className="h-5 w-5" />
                    M&apos;inscrire au Live
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
