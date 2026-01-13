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
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// Teacher Room View Component
function TeacherRoomView() {
  const remoteParticipants = useRemoteParticipants();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  // Update participant count
  useEffect(() => {
    setParticipantCount(remoteParticipants.length);
  }, [remoteParticipants.length]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-900 text-white">
      {/* Header */}
      <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-tight">E-Learning Live</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm text-red-400 font-medium">EN DIRECT</span>
          </div>
          <span className="text-sm text-slate-400">
            {participantCount} participant{participantCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        <VideoConference />
        <RoomAudioRenderer />
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

  if (!session) {
    router.push("/login");
    return null;
  }

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
  }, [params.id]); // Only depend on params.id

  const handleEndLive = useCallback(async () => {
    if (!isTeacher) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir terminer ce live ? Tous les participants seront déconnectés."
    );

    if (!confirmed) return;

    try {
      const result = await endLiveRoom(params.id as string, session?.user.id);
      if (result.success) {
        toast.success("La session a été terminée avec succès");
        router.push("/teacher/dashboard/live");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Impossible de terminer le live");
    }
  }, [isTeacher, params.id, session?.user.id, router]);

  const handleStart = useCallback(async () => {
    const res = await startLiveSession(params.id as string);
    if (res.success) {
      // Update status and reload token
      setStatus("LIVE");
      const tokenRes = await getLiveToken(params.id as string);
      if (tokenRes.success && tokenRes.token) {
        setToken(tokenRes.token);
      }
    } else {
      toast.error(res.error);
    }
  }, [params.id]);

  // 1. Loading State
  if (isInitialLoad || status === "LOADING") {
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
          <video controls className="w-full h-full" src={recordingUrl}>
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      </div>
    );
  }

  // 4. Teacher - Waiting to Start State
  if (status === "SCHEDULED" && isTeacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-muted/20">
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
        <Button
          variant="outline"
          onClick={() => router.push("/teacher/dashboard")}
        >
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  // 5. Student - Waiting State (if somehow a student accesses teacher page)
  if (status === "SCHEDULED" && !isTeacher) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="text-xl font-semibold">En attente du professeur...</h2>
        <p className="text-muted-foreground">La session bientôt disponible.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/student/dashboard")}
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
          <div className="absolute bottom-6 right-6 z-50">
            <Button
              variant="destructive"
              onClick={handleEndLive}
              className="shadow-lg"
            >
              <Power className="h-4 w-4 mr-2" />
              Terminer le Live
            </Button>
          </div>
        )}
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-muted-foreground">État inconnu</p>
    </div>
  );
}
