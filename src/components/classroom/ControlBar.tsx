import { useState } from "react";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { Track, createLocalTracks } from "livekit-client";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ControlBarProps {
  isTeacher: boolean;
  roomCode: string;
  onLeave: () => void;
}

export const ControlBar = ({
  isTeacher,
  roomCode,
  onLeave,
}: ControlBarProps) => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [copied, setCopied] = useState(false);
  const [isTogglingMic, setIsTogglingMic] = useState(false);
  const [isTogglingCamera, setIsTogglingCamera] = useState(false);
  const [isTogglingScreen, setIsTogglingScreen] = useState(false);

  const micTrack = localParticipant.getTrackPublication(
    Track.Source.Microphone
  );
  const cameraTrack = localParticipant.getTrackPublication(Track.Source.Camera);
  const screenTrack = localParticipant.getTrackPublication(
    Track.Source.ScreenShare
  );

  const isMicEnabled = micTrack && !micTrack.isMuted;
  const isCameraEnabled = cameraTrack && !cameraTrack.isMuted;
  const isScreenEnabled = screenTrack && !screenTrack.isMuted;

  const toggleMicrophone = async () => {
    if (isTogglingMic) return;
    setIsTogglingMic(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicEnabled);
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
      toast.error("Failed to toggle microphone");
    } finally {
      setIsTogglingMic(false);
    }
  };

  const toggleCamera = async () => {
    if (!isTeacher || isTogglingCamera) return;
    setIsTogglingCamera(true);
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } catch (error) {
      console.error("Failed to toggle camera:", error);
      toast.error("Failed to toggle camera");
    } finally {
      setIsTogglingCamera(false);
    }
  };

  const toggleScreenShare = async () => {
    if (!isTeacher || isTogglingScreen) return;
    setIsTogglingScreen(true);
    try {
      await localParticipant.setScreenShareEnabled(!isScreenEnabled);
    } catch (error) {
      console.error("Failed to toggle screen share:", error);
      toast.error("Failed to toggle screen share");
    } finally {
      setIsTogglingScreen(false);
    }
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-card rounded-2xl p-3 flex items-center gap-2">
        {/* Room code */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-[8px] mr-2">
          <span className="text-xs text-muted-foreground">Room:</span>
          <span className="font-mono font-bold text-foreground tracking-wider">
            {roomCode}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copyRoomCode}
          >
            {copied ? (
              <Check className="w-3 h-3 text-online" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Microphone */}
        <Button
          variant={isMicEnabled ? "default" : "destructive"}
          size="icon-lg"
          onClick={toggleMicrophone}
          disabled={isTogglingMic}
          className="rounded-[8px]"
        >
          {isMicEnabled ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>

        {/* Camera - Teacher only */}
        {isTeacher && (
          <Button
            variant={isCameraEnabled ? "default" : "secondary"}
            size="icon-lg"
            onClick={toggleCamera}
            disabled={isTogglingCamera}
            className="rounded-[8px]"
          >
            {isCameraEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </Button>
        )}

        {/* Screen Share - Teacher only */}
        {isTeacher && (
          <Button
            variant={isScreenEnabled ? "default" : "secondary"}
            size="icon-lg"
            onClick={toggleScreenShare}
            disabled={isTogglingScreen}
            className="rounded-[8px]"
          >
            {isScreenEnabled ? (
              <Monitor className="w-5 h-5" />
            ) : (
              <MonitorOff className="w-5 h-5" />
            )}
          </Button>
        )}

        <div className="w-px h-8 bg-border mx-2" />

        {/* Leave */}
        <Button
          variant="destructive"
          size="icon-lg"
          onClick={onLeave}
          className="rounded-[8px]"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
