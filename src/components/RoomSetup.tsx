import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserRole,
  generateRoomCode,
  getLiveKitToken,
  RoomCredentials,
} from "@/lib/livekit copy";
import { toast } from "react-toastify";

interface RoomSetupProps {
  role: UserRole;
  onBack: () => void;
  onJoin: (credentials: RoomCredentials) => void;
}

export const RoomSetup = ({ role, onBack, onJoin }: RoomSetupProps) => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState(
    role === "teacher" ? generateRoomCode() : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isTeacher = role === "teacher";

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.info("Share this code with your students");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }

    if (!roomCode.trim()) {
      toast.error("Room code required");
      return;
    }

    setIsLoading(true);
    try {
      const credentials = await getLiveKitToken(
        roomCode.toUpperCase(),
        name.trim(),
        isTeacher
      );
      onJoin(credentials);
    } catch (error) {
      console.error("Failed to join room:", error);
      toast.error("Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${
            isTeacher ? "bg-teacher/5" : "bg-student/5"
          } rounded-full blur-3xl`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold mb-2 text-foreground">
            {isTeacher ? "Create Your Classroom" : "Join a Classroom"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isTeacher
              ? "Set up your room and share the code with students"
              : "Enter the room code from your teacher"}
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Room Code
              </label>
              <div className="relative">
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code"
                  className="h-12 font-mono text-lg tracking-widest pr-12"
                  readOnly={isTeacher}
                  maxLength={6}
                />
                {isTeacher && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={copyRoomCode}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-online" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              {isTeacher && (
                <p className="text-xs text-muted-foreground mt-2">
                  Share this code with your students to let them join
                </p>
              )}
            </div>

            <Button
              variant={isTeacher ? "default" : "destructive"}
              size="lg"
              className="w-full"
              onClick={handleJoin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : isTeacher ? (
                "Start Classroom"
              ) : (
                "Join Classroom"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
