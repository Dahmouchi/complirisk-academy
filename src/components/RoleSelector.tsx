import { motion } from "framer-motion";
import { GraduationCap, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/livekit copy";

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Virtual Classroom</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-foreground">LiveClass</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Connect, teach, and learn in real-time with HD video, voice, and
            chat
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-8 cursor-pointer group"
            onClick={() => onSelectRole("teacher")}
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-teacher/10 flex items-center justify-center group-hover:bg-teacher/20 transition-colors">
                <GraduationCap className="w-8 h-8 text-teacher" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
              I'm a Teacher
            </h2>

            <p className="text-muted-foreground mb-6">
              Create a classroom, share your screen, and teach with full video
              and audio control
            </p>

            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teacher" />
                Camera & screen sharing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teacher" />
                Voice communication
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teacher" />
                Room management
              </li>
            </ul>

            <Button variant="default" size="lg" className="w-full">
              Create Classroom
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-8 cursor-pointer group"
            onClick={() => onSelectRole("student")}
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-student/10 flex items-center justify-center group-hover:bg-student/20 transition-colors">
                <Users className="w-8 h-8 text-student" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
              I'm a Student
            </h2>

            <p className="text-muted-foreground mb-6">
              Join a classroom using a room code and participate with voice and
              chat
            </p>

            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-student" />
                Voice participation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-student" />
                Real-time chat
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-student" />
                Watch live lessons
              </li>
            </ul>

            <Button variant="destructive" size="lg" className="w-full">
              Join Classroom
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
