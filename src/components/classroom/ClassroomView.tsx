import { useState } from "react";
import { useParticipants } from "@livekit/components-react";
import { motion } from "framer-motion";
import { MessageCircle, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoTile } from "./VideoTile";
import { ChatPanel } from "./ChatPanel";
import { ParticipantsList } from "./ParticipantsList";
import { ControlBar } from "./ControlBar";

interface ClassroomViewProps {
  isTeacher: boolean;
  roomCode: string;
  participantName: string;
  onLeave: () => void;
}

export const ClassroomView = ({
  isTeacher,
  roomCode,
  participantName,
  onLeave,
}: ClassroomViewProps) => {
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const participants = useParticipants();

  // First participant is usually the teacher
  const teacherParticipant = participants[0];
  const studentParticipants = participants.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">LiveClass</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs font-medium text-destructive">LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showParticipants ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setShowParticipants(!showParticipants);
                if (!showParticipants) setShowChat(false);
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              {participants.length}
            </Button>
            <Button
              variant={showChat ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setShowChat(!showChat);
                if (!showChat) setShowParticipants(false);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 pb-28 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {teacherParticipant && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <VideoTile
                  participant={teacherParticipant}
                  isTeacher={true}
                  isMain={true}
                />
              </motion.div>
            )}

            {studentParticipants.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {studentParticipants.map((participant) => (
                  <motion.div
                    key={participant.identity}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <VideoTile participant={participant} isTeacher={false} />
                  </motion.div>
                ))}
              </div>
            )}

            {participants.length === 1 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Waiting for participants to join...</p>
                <p className="text-sm mt-2">
                  Share the room code:{" "}
                  <strong className="font-mono">{roomCode}</strong>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {(showChat || showParticipants) && (
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col"
        >
          <div className="flex items-center justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowChat(false);
                setShowParticipants(false);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden p-4 pt-0">
            {showChat && <ChatPanel isTeacher={isTeacher} />}
            {showParticipants && (
              <ParticipantsList
                teacherIdentity={teacherParticipant?.identity}
              />
            )}
          </div>
        </motion.aside>
      )}

      <ControlBar isTeacher={isTeacher} roomCode={roomCode} onLeave={onLeave} />
    </div>
  );
};
