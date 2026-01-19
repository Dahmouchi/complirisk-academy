// app/live/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  useLocalParticipant,
  useRemoteParticipants,
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
  Power,
  Maximize,
  Minimize,
  AlertCircle,
  Users,
  Clock,
  Settings,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// Teacher Room View Component
function TeacherRoomView() {
  const remoteParticipants = useRemoteParticipants();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Update participant count
  useEffect(() => {
    setParticipantCount(remoteParticipants.length);
  }, [remoteParticipants.length]);

  // Timer for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      {/* Modern Header with Glass Effect */}
      <div
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showControls
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Branding & Status */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-lg tracking-tight">
                      E-Learning Live
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">
                        En Direct
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Stats */}
                <div className="flex items-center gap-6 pl-6 border-l border-slate-700">
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">
                      {participantCount}
                    </span>
                    <span className="text-xs text-slate-400">
                      participant{participantCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium font-mono">
                      {formatTime(elapsedTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Content */}
      <div className="flex-1 relative overflow-hidden">
        <VideoConference />
        <RoomAudioRenderer />

        {/* Participant Count Overlay (Bottom Left) */}
        {participantCount > 0 && (
          <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(3, participantCount))].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900"
                  />
                ))}
                {participantCount > 3 && (
                  <div className="h-6 w-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      +{participantCount - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-slate-200">
                {participantCount} viewer{participantCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Teacher Page Component
export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState<any>(null);
  const [roomName, setRoomName] = useState<any>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [status, setStatus] = useState<string>("LOADING");
  const [recordingUrl, setRecordingUrl] = useState<any>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const hasFetched = useRef(false);

  // Fetch credentials on mount - ONLY ONCE
  useEffect(() => {
    if (hasFetched.current) return;

    async function fetchCredentials() {
      if (!params.id) return;

      try {
        hasFetched.current = true;
        const res = await getLiveToken(params.id as string);

        if (res.success) {
          setToken(res.token);
          setRoomName(res.roomName);
          setIsTeacher(res.isTeacher || false);
          setStatus(res.status || "LOADING");
          setRecordingUrl(res.recordingUrl || null);
        } else {
          setStatus("ERROR");
          toast.error(res.error || "Erreur de chargement");
        }
      } catch (error) {
        setStatus("ERROR");
        toast.error("Erreur de connexion au serveur");
      } finally {
        setIsInitialLoad(false);
      }
    }

    fetchCredentials();
  }, [params.id]);

  const handleEndLive = useCallback(async () => {
    if (!isTeacher || !session?.user?.id) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir terminer ce live ? Tous les participants seront déconnectés.",
    );

    if (!confirmed) return;

    try {
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
  }, [isTeacher, params.id, session?.user?.id, router]);

  const handleStart = useCallback(async () => {
    const res = await startLiveSession(params.id as string);
    if (res.success) {
      setStatus("LIVE");
      const tokenRes = await getLiveToken(params.id as string);
      if (tokenRes.success && tokenRes.token) {
        setToken(tokenRes.token);
      }
    } else {
      toast.error(res.error);
    }
  }, [params.id]);

  if (!session) {
    router.push("/login");
    return null;
  }

  // 1. Loading State
  if (isInitialLoad || status === "LOADING") {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 relative" />
        </div>
        <p className="text-slate-400 font-medium">
          Chargement de la session...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (status === "ERROR") {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-white">
            Erreur d&apos;accès
          </p>
          <p className="text-slate-400">Impossible de charger la session</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Retour
        </Button>
      </div>
    );
  }

  // 3. Ended State (Show Recording)
  if (status === "ENDED" && recordingUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Replay de la Session
            </h1>
            <p className="text-slate-400">
              Session terminée - Enregistrement disponible
            </p>
          </div>
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <video controls className="w-full h-full" src={recordingUrl}>
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        </div>
      </div>
    );
  }

  // 4. Teacher - Waiting to Start State
  if (status === "SCHEDULED" && isTeacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 bg-blue-500/10 rounded-full inline-block">
            <Video className="h-16 w-16 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Prêt à commencer ?</h2>
          <p className="text-slate-400 text-lg">
            Votre session n&apos;a pas encore commencé. Cliquez sur le bouton
            ci-dessous pour démarrer le live.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            onClick={handleStart}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl"
          >
            <Video className="h-6 w-6" />
            Démarrer le Live
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/teacher/dashboard")}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  // 5. Student - Waiting State
  if (status === "SCHEDULED" && !isTeacher) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <h2 className="text-2xl font-semibold text-white">
          En attente du professeur...
        </h2>
        <p className="text-slate-400">La session sera bientôt disponible.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/student/dashboard")}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Retour
        </Button>
      </div>
    );
  }

  // 6. Live State (Connect LiveKit)
  if (status === "LIVE" && token && roomName) {
    return (
      <LiveKitRoom
        className="bg-white"
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={true}
        onDisconnected={() => {
          console.log("Teacher disconnected");
          if (isTeacher) {
            toast.info("Vous avez été déconnecté");
          }
        }}
      >
        <TeacherRoomView />
        {isTeacher && (
          <div className="absolute bottom-8 right-8 z-50">
            <Button
              variant="destructive"
              onClick={handleEndLive}
              className="shadow-2xl bg-red-600 hover:bg-red-700 px-6 py-6 text-base gap-2"
              size="lg"
            >
              <Power className="h-5 w-5" />
              Terminer le Live
            </Button>
          </div>
        )}
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <p className="text-slate-400">État inconnu</p>
    </div>
  );
}
