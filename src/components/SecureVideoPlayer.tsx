"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export function SecureVideoPlayer({
  liveId,
  poster,
  watermark,
}: {
  liveId: string;
  poster?: string;
  watermark: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSeeking) return;
    handleSeek(e);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key.toLowerCase() === "s")
      ) {
        e.preventDefault();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", blockKeys);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", blockKeys);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className="relative aspect-video w-full rounded-2xl bg-black"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* VIDEO (NO POINTER EVENTS) */}
      <video
        ref={videoRef}
        src={`/api/livekit/replay?id=${liveId}`}
        playsInline
        preload="metadata"
        poster={poster}
        className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
      />

      {/* WATERMARK */}
      <div className="absolute top-4 right-4 text-white/40 text-xs select-none pointer-events-none">
        {watermark}
      </div>

      {/* PLAY OVERLAY */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-black ml-1" />
          </div>
        </button>
      )}

      {/* CONTROLS */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
        {/* PROGRESS BAR */}
        <div
          ref={progressBarRef}
          className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
          onClick={handleSeek}
          onMouseDown={handleSeekStart}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekEnd}
          onMouseLeave={handleSeekEnd}
        >
          <div
            className="h-full bg-white rounded-full relative group-hover:bg-blue-500 transition-colors"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* BUTTONS AND TIME */}
        <div className="flex items-center justify-between text-white">
          <div className="flex gap-3 items-center">
            <button
              onClick={togglePlay}
              className="hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="hover:scale-110 transition-transform"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <span className="text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={handleFullscreen}
            className="hover:scale-110 transition-transform"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
