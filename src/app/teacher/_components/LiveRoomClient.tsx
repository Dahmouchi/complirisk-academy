"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  VideoConference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  MessageSquare,
  Users,
  Info,
  X,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getLiveToken, endLiveRoom } from "@/actions/live-room";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

interface LiveRoomClientProps {
  liveRoom: any;
  user: any;
  isTeacher: boolean;
}

export function LiveRoomClient({
  liveRoom,
  user,
  isTeacher,
}: LiveRoomClientProps) {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const result = await getLiveToken(liveRoom.id);
        if (result.success && result.token) {
          setToken(result.token);
        } else {
          setError(result.error || "Impossible de rejoindre le live");
        }
      } catch (err) {
        setError("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [liveRoom.id, user.id]);

  const handleEndLive = async () => {
    if (!isTeacher) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir terminer ce live ? Tous les participants seront déconnectés."
    );

    if (!confirmed) return;

    try {
      const result = await endLiveRoom(liveRoom.id, user.id);
      if (result.success) {
        toast("La session a été terminée avec succès");
        router.push("/teacher/dashboard/live");
      } else {
        toast(result.error);
      }
    } catch (error) {
      toast("Impossible de terminer le live");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Connexion au live...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Impossible de rejoindre</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() =>
                router.push(
                  isTeacher
                    ? "/dashboard/teacher/lives"
                    : "/dashboard/student/lives"
                )
              }
            >
              Retour
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className=" px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 hover:bg-red-600">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                EN DIRECT
              </Badge>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg">{liveRoom.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {liveRoom.subject.name} • {liveRoom.teacher.prenom}{" "}
                  {liveRoom.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Users className="h-5 w-5" />
                )}
              </Button>
              {isTeacher && (
                <Button variant="destructive" onClick={handleEndLive}>
                  Terminer le Live
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <LiveKitRoom
            video={isTeacher}
            audio={isTeacher}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            data-lk-theme="default"
            style={{ height: "100%" }}
            className="bg-black"
          >
            {/* Utilisation du composant VideoConference pré-construit pour une meilleure gestion du layout et du partage d'écran */}
            <VideoConference
              chatMessageFormatter={(msg) => msg.length} // Optionnel: formateur de message
            />

            {/* RoomAudioRenderer est nécessaire pour entendre les autres participants */}
            <RoomAudioRenderer />

            {/* ControlBar gère les contrôles de média. Notez que VideoConference inclut déjà une ControlBar par défaut, 
                mais si vous voulez la personnaliser, vous pouvez passer des props à VideoConference ou utiliser ControlBar séparément. */}
          </LiveKitRoom>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-full lg:w-96 border-l bg-card flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="participants" className="gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-2">
                  <Info className="h-4 w-4" />
                  Info
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="chat"
                className="flex-1 flex flex-col m-0 p-0"
              >
                <ChatPanel liveRoom={liveRoom} user={user} />
              </TabsContent>

              <TabsContent value="participants" className="flex-1 m-0 p-4">
                <ParticipantsPanel liveRoom={liveRoom} />
              </TabsContent>

              <TabsContent value="info" className="flex-1 m-0 p-4">
                <InfoPanel liveRoom={liveRoom} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Chat Panel (Inchangé mais conservé pour la structure)
function ChatPanel({ liveRoom, user }: { liveRoom: any; user: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: {
        id: user.id,
        name: `${user.prenom || ""} ${user.name || ""}`.trim(),
      },
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucun message pour le moment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Soyez le premier à envoyer un message !
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                </div>
                <p className="text-sm bg-muted p-2 rounded-lg">
                  {message.text}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composant Participants Panel (Inchangé)
function ParticipantsPanel({ liveRoom }: { liveRoom: any }) {
  const participants = [
    {
      ...liveRoom.teacher,
      role: "Enseignant",
    },
    ...liveRoom.participants.map((p: any) => ({
      ...p.user,
      role: "Étudiant",
    })),
  ];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            Participants ({participants.length})
          </h3>
        </div>

        {participants.map((participant: any) => {
          const name = `${participant.prenom || ""} ${
            participant.name || ""
          }`.trim();
          const initials = `${participant.prenom?.[0] || ""}${
            participant.name?.[0] || ""
          }`;

          return (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.image} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {participant.role}
                </p>
              </div>
              {participant.role === "Enseignant" && (
                <Badge variant="secondary">Hôte</Badge>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

// Composant Info Panel (Inchangé)
function InfoPanel({ liveRoom }: { liveRoom: any }) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">À propos</h3>
          <p className="text-sm text-muted-foreground">
            {liveRoom.description || "Aucune description disponible"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Détails</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Video className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Matière</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: liveRoom.subject.color }}
                  />
                  <p className="text-sm text-muted-foreground">
                    {liveRoom.subject.name}
                  </p>
                </div>
              </div>
            </div>

            {liveRoom.duration && (
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Durée prévue</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {liveRoom.duration} minutes
                  </p>
                </div>
              </div>
            )}

            {liveRoom.startsAt && (
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Début</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(liveRoom.startsAt), "PPP 'à' HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Fonctionnalités</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">Enregistrement</span>
              <Badge
                variant={liveRoom.recordingEnabled ? "default" : "secondary"}
              >
                {liveRoom.recordingEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">Chat</span>
              <Badge variant={liveRoom.chatEnabled ? "default" : "secondary"}>
                {liveRoom.chatEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
