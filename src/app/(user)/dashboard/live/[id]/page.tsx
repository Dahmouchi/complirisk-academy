// app/student/live/[id]/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  ControlBar,
  TrackToggle,
  useTracks,
  useRemoteParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomAudioRenderer } from "@livekit/components-react";
import { getLiveToken } from "@/actions/live-room";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Video,
  AlertCircle,
  ArrowLeft,
  Mic,
  MicOff,
  Users,
  MessageSquare,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Headphones,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// Component for the main student view inside LiveKitRoom context
function StudentRoomView() {
  const router = useRouter();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Get all remote participants
  const remoteParticipants = useRemoteParticipants();

  // Filter to find teacher (adjust based on your naming convention)
  const teacher = remoteParticipants.find(
    (p) =>
      p.identity.toLowerCase().includes("teacher") ||
      p.identity.toLowerCase().includes("professor") ||
      p.identity.toLowerCase().includes("enseignant")
  );

  const otherParticipants = remoteParticipants.filter((p) => p !== teacher);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Audio activé" : "Audio désactivé");
  };

  return (
    <div className="h-screen w-full flex bg-slate-900 text-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/student/dashboard")}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex flex-col">
              <span className="font-semibold">Session en cours</span>
              <span className="text-xs text-slate-400">
                Classe de Mathématiques
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm text-red-400 font-medium">
                EN DIRECT
              </span>
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-600" />

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm">
                {remoteParticipants.length + 1} participants
              </span>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullscreen}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
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
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Teacher View (Largest) */}
          <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
            {teacher ? (
              <div></div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg">Professeur</p>
                <p className="text-slate-500 text-sm mt-2">
                  En attente de connexion
                </p>
              </div>
            )}

            {/* Teacher name overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-md">
              <p className="text-white font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Professeur
              </p>
            </div>
          </div>

          {/* Other Participants Grid */}
          {otherParticipants.length > 0 && (
            <div className="h-48 border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">
                  Autres participants ({otherParticipants.length})
                </h3>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 h-36 overflow-y-auto">
                {otherParticipants.slice(0, 12).map((participant) => (
                  <div
                    key={participant.sid}
                    className="bg-slate-800 rounded-lg overflow-hidden relative aspect-video"
                  >
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-1">
                      <p className="text-xs truncate text-white">
                        {participant.identity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Controls Bar */}
        <div className="h-20 border-t border-slate-700 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            {/* Microphone Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="lg"
                    className="rounded-full h-12 w-12"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? (
                      <Mic className="h-5 w-5" />
                    ) : (
                      <MicOff className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAudioEnabled ? "Désactiver le micro" : "Activer le micro"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Audio Mute Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-slate-700 text-white hover:bg-slate-800"
                    onClick={handleToggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isMuted ? "Activer l'audio" : "Désactiver l'audio"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-10 bg-slate-600" />

            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-slate-300">Connecté</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function StudentLiveRoomPage() {
  const params = useParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [status, setStatus] = useState<any>("LOADING");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch token and room status
  const fetchRoomStatus = async () => {
    if (!params.id) return;

    try {
      const res = await getLiveToken(params.id as string);

      if (res.success) {
        setStatus(res.status);
        setRecordingUrl(res.recordingUrl || null);

        if (!token && res.token) {
          setToken(res.token);
          setRoomName(res.roomName);
        }
      } else {
        setStatus("ERROR");
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    fetchRoomStatus();

    if (status === "SCHEDULED") {
      pollingRef.current = setInterval(() => {
        fetchRoomStatus();
      }, 5000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [status, params.id]);

  // 1. Initial Loading
  if (status === "LOADING") {
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
      <div className="h-screen flex items-center justify-center flex-col gap-4 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
        <h2 className="text-2xl font-bold">
          Impossible d&apos;accéder à cette session
        </h2>
        <p className="text-muted-foreground max-w-md">
          Soit la session a été annulée, soit vous n&apos;avez pas les droits
          d&apos;accès.
        </p>
        <Button
          onClick={() => router.push("/student/dashboard")}
          className="mt-4"
        >
          Retour au Tableau de bord
        </Button>
      </div>
    );
  }

  // 3. Waiting State (Scheduled, but teacher hasn't started)
  if (status === "SCHEDULED") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-4">
        <div className="relative">
          <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
          <Headphones className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-3xl font-bold text-slate-800">
            En attente du professeur...
          </h2>
          <p className="text-lg text-slate-600">
            Cette session n&apos;a pas encore commencé. Veuillez patienter. La
            page se mettra à jour automatiquement.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/student/dashboard")}
          className="mt-8"
        >
          Annuler
        </Button>
      </div>
    );
  }

  // 4. Live State (Active Room)
  if (status === "LIVE" && token && roomName) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={false} // Students cannot use video
        onDisconnected={() => {
          toast.info("Déconnecté de la session");
          router.push("/student/dashboard");
        }}
      >
        {/* Custom student view inside LiveKitRoom context */}
        <StudentRoomView />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  // 5. Ended State (Show Recording)
  if (status === "ENDED" && recordingUrl) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 h-screen flex flex-col items-center justify-start">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            Replay de la session
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/student/dashboard")}
          >
            Retour
          </Button>
        </div>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <video
            controls
            className="w-full h-full"
            src={recordingUrl}
            preload="metadata"
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>

        <div className="mt-6 text-center text-muted-foreground">
          <p>
            La session est terminée. Vous pouvez revoir l&apos;enregistrement
            ci-dessus.
          </p>
        </div>
      </div>
    );
  }

  // 6. Fallback if Ended but no URL
  if (status === "ENDED" && !recordingUrl) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <Video className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">Session Terminée</h2>
        <p className="text-muted-foreground mt-2">
          L&apos;enregistrement sera bientôt disponible.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/student/dashboard")}
        >
          Retour au Dashboard
        </Button>
      </div>
    );
  }

  return null;
}
