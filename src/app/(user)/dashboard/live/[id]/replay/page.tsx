"use client";
import {
  Video,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageSquare,
  Send,
  Heart,
  Share2,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLiveReplay, getLivesRegistred } from "@/actions/live-room";
import QuizDisplay from "@/app/(user)/_components/quizSection";
import { useSession } from "next-auth/react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { SecureVideoPlayer } from "@/components/SecureVideoPlayer";
const LiveReplay = () => {
  const router = useRouter();
  const params = useParams();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [live, setLive] = useState<any>();
  const [loading, setLoading] = useState(false);
  const id = params.id as string;
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<any>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: any) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: any) => {
    if (videoRef.current && duration) {
      const progressBar = e.currentTarget;
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const width = progressBar.clientWidth;
      const percentage = clickPosition / width;
      const newTime = percentage * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        if (id) {
          const res = await getLiveReplay(id);
          setLive(res.live);
          console.log(res);
        }
      } catch (error) {}
      setLoading(false);
    };
    loadData();
  }, []);
  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, send message to chat
      setMessage("");
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto bg-background pb-[50px]">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="font-semibold line-clamp-1">{live?.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{live?.teacher?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 p-0 lg:p-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {live?.signedRecordingUrl && (
              <SecureVideoPlayer
                liveId={live.id}
                poster={live.image}
                watermark={`${session?.user.email} · ${new Date().toLocaleDateString()}`}
              />
            )}

            {/* Session Details - Mobile & Desktop */}
            <div className=" lg:p-0 lg:mt-6 lg:mb-0">
              <div className="bg-white lg:rounded-2xl p-4 card-shadow  lg:p-4 lg:shadow-none">
                <QuizDisplay quizzes={[]} userId={session?.user.id || ""} />
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1 ">
            <div className="bg-white lg:rounded-2xl p-4 card-shadow  lg:p-4 lg:shadow-none">
              <h2 className="text-xl font-bold mb-3">{live?.name}</h2>

              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-background">
                  <AvatarImage src={live?.teacher.image} />
                  <AvatarFallback>{live?.teacher.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {live?.teacher.name} {live?.teacher.prenom}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {live?.teacher.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(live?.startsAt)}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1">
                  <Users className="w-4 h-4" />
                  <span>{live?.participants?.length} participants</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  About this session
                </h3>
                <p className="text-sm text-muted-foreground">
                  {live?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveReplay;
