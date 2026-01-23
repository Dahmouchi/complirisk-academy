// app/live/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
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
  Monitor,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import QuizDisplay from "@/app/(user)/_components/quizSection";

// Props for the internal view
interface TeacherViewProps {
  quiz: any[];
  onEndSession: () => void;
  isTeacher: boolean;
  userId: string;
}

// Teacher Room View Component - REFACTORED FOR RESPONSIVENESS
function TeacherRoomView({
  quiz,
  onEndSession,
  isTeacher,
  userId,
}: TeacherViewProps) {
  const remoteParticipants = useRemoteParticipants();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  // We keep controls always visible on mobile for better UX, toggle on desktop
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

  // Auto-hide controls logic (Desktop only recommended)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      // Only auto-hide on larger screens to prevent mobile frustration
      if (window.innerWidth > 768) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* 1. TOP HEADER (Fixed Height) */}
      <div className="h-16 z-50 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 shadow-md shrink-0">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg hidden sm:block">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight">
                E-Learning
              </span>
              <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Stats */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-sm font-medium">{participantCount}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <Clock className="h-3.5 w-3.5 text-green-400" />
            <span className="text-sm font-medium font-mono">
              {formatTime(elapsedTime)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreen}
            className="hidden sm:flex hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 2. MAIN CONTENT SPLIT (Responsive Flex) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* A. VIDEO AREA (Top on Mobile, Left on Desktop) */}
        <div className="w-full h-[50vh] lg:h-full lg:flex-1 bg-black relative flex flex-col">
          <div className="flex-1 relative">
            {/* Ensure LiveKit fits well */}
            <VideoConference />
          </div>
        </div>

        {/* B. SIDEBAR (Bottom on Mobile, Right on Desktop) */}
        <div className="w-full lg:w-[400px] h-full bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
          {/* Sidebar Tabs/Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold flex items-center gap-2 text-slate-200">
              <BookOpen className="h-4 w-4 text-purple-400" />
              Gestion de classe
            </h3>
          </div>

          {/* Scrollable Content (Quiz) */}
          <div className="flex-1 overflow-y-auto p-4">
            {quiz.length > 0 ? (
              <QuizDisplay quizzes={quiz} userId={userId} />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-center p-4 border border-dashed border-slate-800 rounded-xl">
                <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Aucun quiz actif.</p>
              </div>
            )}
          </div>

          {/* Sidebar Footer (Actions) */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            {isTeacher && (
              <Button
                variant="destructive"
                onClick={onEndSession}
                className="w-full shadow-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-6"
                size="lg"
              >
                <Power className="h-5 w-5 mr-2" />
                Terminer le Live
              </Button>
            )}
          </div>
        </div>
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
  const [quiz, setQuiz] = useState<any>([]);
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
          setQuiz(res.quizzes || []);
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

  // 6. Live State (Connect LiveKit) - Passing Props correctly
  if (status === "LIVE" && token && roomName) {
    return (
      <LiveKitRoom
        className="bg-slate-950"
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
        <TeacherRoomView
          quiz={quiz}
          onEndSession={handleEndLive}
          isTeacher={isTeacher}
          userId={session?.user.id || ""}
        />
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
