"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
  Music,
  Code,
  Atom,
} from "lucide-react";
import { Subject } from "@/types/student";
import { useRouter } from "next/navigation";
import { getSubjectProgress } from "@/actions/progress";

interface SubjectCardNewProps {
  subject: Subject;
  userId: string;
  delay?: number;
}

const icons = [
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
  Music,
  Code,
  Atom,
];

const getRandomIcon = () => {
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  return <Icon className="w-8 h-8 text-white" />;
};

export const SubjectCardNew = ({
  subject,
  userId,
  delay = 0,
}: SubjectCardNewProps) => {
  const [icon, setIcon] = useState<React.ReactNode>(null);

  // For random icons (different each time)
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const router = useRouter();
  useEffect(() => {
    const fetchProgress = async () => {
      setIcon(getRandomIcon());
      const progressData = await getSubjectProgress(userId, subject.id);
      setProgress(progressData);
    };

    fetchProgress();
  }, [userId, subject.id]);

  return (
    <motion.div
      onClick={() => router.push(`/dashboard/matiere/${subject.handler}`)}
      className="bg-card h-full rounded-[6px] shadow-lg border border-border overflow-hidden cursor-pointer group"
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Header avec gradient */}
      <div
        className="p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${subject.color}, ${subject.color}cc)`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-[8px] backdrop-blur-sm">
              {icon || <div className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-xl font-bold">{subject.name}</h3>
              {(subject as any).gradeName && (
                <p className="text-xs text-white/80 mt-1 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  {(subject as any).gradeName}
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {subject.description}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {subject?.courses?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Cours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {progress.completed}
            </p>
            <p className="text-xs text-muted-foreground">Terminés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {progress.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">Progression</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression globale</span>
            <span className="font-semibold text-foreground">
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{
                background: `linear-gradient(to right, ${subject.color}, ${subject.color}cc)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
