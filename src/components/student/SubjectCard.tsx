import { Subject } from "@/types/student";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Play } from "lucide-react";
import Progress from "../ui/progress";

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  delay?: number;
  onClick?: () => void;
}

export const SubjectCard = ({
  subject,
  progress,
  delay = 0,
  onClick,
}: SubjectCardProps) => {
  const totalCourses = subject.courses?.length || 0;
  const completedCourses = Math.floor((progress / 100) * totalCourses);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[6px] bg-card border border-border/50 p-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: subject.color }}
      />

      {/* Hover gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        className="absolute inset-0 bg-gradient-to-br from-primary to-accent"
      />

      <div className="relative z-10">
        {/* Icon and title */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-[8px]"
            style={{ backgroundColor: `${subject.color}20` }}
          >
            <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
          </div>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="p-2 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </div>

        {/* Subject info */}
        <h3 className="text-lg font-semibold text-foreground mb-1 font-display">
          {subject.name}
        </h3>
        {subject.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {subject.description}
          </p>
        )}

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCourses}/{totalCourses} cours
            </span>
            <span className="font-medium" style={{ color: subject.color }}>
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Continue button */}
        {progress > 0 && progress < 100 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Continuer
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
