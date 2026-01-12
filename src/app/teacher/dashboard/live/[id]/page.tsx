// app/live/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
  useLocalParticipant,
  useRoomContext,
  TrackToggle,
  useTracks,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomAudioRenderer } from "@livekit/components-react";
import {
  endLiveRoom,
  getLiveToken,
  startLiveSession,
} from "@/actions/live-room";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  Users,
  MessageSquare,
  Settings,
  Power,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  MoreVertical,
  Share2,
  Copy,
  Maximize,
  Minimize,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState<any>();
  const [roomName, setRoomName] = useState<any>();
  const [isTeacher, setIsTeacher] = useState(false);
  const [status, setStatus] = useState<string>("LOADING");
  const [recordingUrl, setRecordingUrl] = useState<any>();
  const [participantCount, setParticipantCount] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);
  const [participantsVisible, setParticipantsVisible] = useState(true);
  const [roomLocked, setRoomLocked] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; user: string; message: string; time: string }>
  >([]);

  // Fetch credentials on mount
  useEffect(() => {
    async function fetchCredentials() {
      if (!params.id) return;
      const res = await getLiveToken(params.id as string);

      if (res.success) {
        setToken(res.token);
        setRoomName(res.roomName);
        setIsTeacher(res.isTeacher || false);
        setStatus(res.status || "LOADING");
        setRecordingUrl(res.recordingUrl || null);
      } else {
        setStatus("ERROR");
        toast.error(res.error);
      }
    }
    fetchCredentials();
  }, [params.id]);

  const handleEndLive = async () => {
    if (!isTeacher) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir terminer ce live ? Tous les participants seront déconnectés."
    );

    if (!confirmed) return;

    try {
      if (!session?.user.id) {
        return;
      }

      const result = await endLiveRoom(params.id as string, session.user.id);
      if (result.success) {
        toast.success("La session a été terminée avec succès");
        router.push("/teacher/dashboard/live");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Impossible de terminer le live");
    }
  };

  const handleStart = async () => {
    const res = await startLiveSession(params.id as string);
    if (res.success) {
      window.location.reload();
    } else {
      toast.error(res.error);
    }
  };

  const handleScreenShare = async () => {
    // This would be implemented with LiveKit's screen sharing API
    setIsScreenSharing(!isScreenSharing);
    toast.info(
      isScreenSharing ? "Partage d'écran arrêté" : "Partage d'écran démarré"
    );
  };

  const handleToggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const handleToggleParticipants = () => {
    setParticipantsVisible(!participantsVisible);
  };

  const handleToggleRoomLock = () => {
    setRoomLocked(!roomLocked);
    toast.info(roomLocked ? "Salle déverrouillée" : "Salle verrouillée");
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/live/${params.id}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Lien d'invitation copié !");
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: session?.user?.name || "Vous",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setChatMessage("");
    }
  };

  const TeacherControls = () => (
    <div className="flex items-center gap-2">
      {/* Room Lock/Unlock */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleRoomLock}
              className="text-white hover:bg-slate-700"
            >
              {roomLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {roomLocked ? "Déverrouiller la salle" : "Verrouiller la salle"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Screen Share */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isScreenSharing ? "default" : "ghost"}
              size="icon"
              onClick={handleScreenShare}
              className={`${
                isScreenSharing
                  ? "bg-red-600 hover:bg-red-700"
                  : "text-white hover:bg-slate-700"
              }`}
            >
              {isScreenSharing ? (
                <ScreenShareOff className="h-4 w-4" />
              ) : (
                <ScreenShare className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isScreenSharing
              ? "Arrêter le partage d'écran"
              : "Partager l'écran"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Invite Participants */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyInviteLink}
              className="text-white hover:bg-slate-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copier le lien d'invitation</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* More Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-700"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Bell className="h-4 w-4 mr-2" />
            Gérer les notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres avancés
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Enregistrer la session
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEndLive} className="text-red-600">
            <Power className="h-4 w-4 mr-2" />
            Terminer le live
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Participant Tracker Component - must be inside LiveKitRoom context
  const ParticipantTracker = () => {
    const participants = useParticipants();

    useEffect(() => {
      setParticipantCount(participants.length);
    }, [participants]);

    return null; // This component doesn't render anything
  };

  // 1. Loading State
  if (status === "LOADING" || !token) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Chargement de la session...</p>
      </div>
    );
  }

  // 2. Error State
  if (status === "ERROR") {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Erreur d'accès</p>
        <Button onClick={() => router.back()}>Retour</Button>
      </div>
    );
  }

  // 3. Ended State (Show Recording)
  if (status === "ENDED" && recordingUrl) {
    return (
      <div className="max-w-5xl mx-auto p-6 h-screen flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Replay: Session Terminée</h1>
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            controls
            className="w-full h-full"
            src={recordingUrl}
            poster="/placeholder-image.jpg"
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      </div>
    );
  }

  // 4. Teacher - Waiting to Start State
  if (status === "SCHEDULED" && isTeacher) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-muted/20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Prêt à commencer ?</h2>
          <p className="text-muted-foreground">
            Votre session n'a pas encore commencé.
          </p>
        </div>
        <Button size="lg" onClick={handleStart} className="gap-2">
          <Video className="h-5 w-5" />
          Démarrer le Live
        </Button>
      </div>
    );
  }

  // 5. Student - Waiting State
  if (status === "SCHEDULED" && !isTeacher) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="text-xl font-semibold">En attente du professeur...</h2>
        <p className="text-muted-foreground">La session bientôt disponible.</p>
      </div>
    );
  }

  // 6. Live State (Connect LiveKit)
  if (status === "LIVE" && token && roomName) {
    return (
      <div className="h-screen w-full flex bg-slate-900 text-white">
        {/* Sidebar - Chat & Participants */}
        <div className="flex">
          {/* Participants Panel */}
          {participantsVisible && (
            <div className="w-64 border-r border-slate-700 bg-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Participants ({participantCount})
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleParticipants}
                    className="h-6 w-6"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {/* Participant list would go here */}
                <div className="p-2 hover:bg-slate-700 rounded">
                  <span className="font-medium">{session?.user?.name}</span>
                  <Badge
                    variant={isTeacher ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {isTeacher ? "Professeur" : "Étudiant"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {chatVisible && (
            <div className="w-80 border-r border-slate-700 bg-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Chat</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleChat}
                    className="h-6 w-6"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-blue-300">
                        {msg.user}
                      </span>
                      <span className="text-xs text-slate-400">{msg.time}</span>
                    </div>
                    <p className="mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="bg-slate-700 border-slate-600"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
            <div className="flex items-center gap-4">
              <span className="font-semibold tracking-tight">
                E-Learning Live
              </span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm text-red-400 font-medium">
                  EN DIRECT
                </span>
              </div>
              <Badge
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                {roomName}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Visibility Toggles */}
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleParticipants}
                        className="text-white hover:bg-slate-700"
                      >
                        {participantsVisible ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {participantsVisible
                        ? "Masquer participants"
                        : "Afficher participants"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleChat}
                        className="text-white hover:bg-slate-700"
                      >
                        {chatVisible ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {chatVisible ? "Masquer chat" : "Afficher chat"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleFullscreen}
                        className="text-white hover:bg-slate-700"
                      >
                        {isFullscreen ? (
                          <Minimize className="h-4 w-4" />
                        ) : (
                          <Maximize className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-6 bg-slate-600" />

              {/* Teacher Controls */}
              {isTeacher && <TeacherControls />}
            </div>
          </div>

          {/* LiveKit Room */}
          <div className="flex-1 relative overflow-hidden">
            <LiveKitRoom
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              connect={true}
              audio={true}
              video={true}
              onDisconnected={() => {
                console.log("Disconnected");
                if (isTeacher) {
                  toast.info("Vous avez été déconnecté");
                }
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <ParticipantTracker />
              <VideoConference />
              <RoomAudioRenderer />

              {/*<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-700">
                  Camera Toggle 
                  <TrackToggle source={Track.Source.Camera}>
                    {({
                      enabled,
                      toggle,
                    }: {
                      enabled: boolean;
                      toggle: () => void;
                    }) => (
                      <Button
                        variant={enabled ? "default" : "destructive"}
                        size="icon"
                        className="rounded-full"
                        onClick={toggle}
                      >
                        {enabled ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TrackToggle>

                  <TrackToggle source={Track.Source.Microphone}>
                    {({
                      enabled,
                      toggle,
                    }: {
                      enabled: boolean;
                      toggle: () => void;
                    }) => (
                      <Button
                        variant={enabled ? "default" : "destructive"}
                        size="icon"
                        className="rounded-full"
                        onClick={toggle}
                      >
                        {enabled ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TrackToggle>

                  {isTeacher && (
                    <Button
                      variant={isScreenSharing ? "destructive" : "default"}
                      size="icon"
                      className="rounded-full"
                      onClick={handleScreenShare}
                    >
                      {isScreenSharing ? (
                        <ScreenShareOff className="h-4 w-4" />
                      ) : (
                        <ScreenShare className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={isTeacher ? handleEndLive : () => router.push("/")}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </div>*/}
            </LiveKitRoom>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
