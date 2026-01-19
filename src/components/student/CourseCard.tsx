import { motion } from "framer-motion";
import { Clock, FileText, Play, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/student";

interface CourseCardProps {
  course: Course;
  subjectColor: string;
  isCompleted?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const CourseCard = ({
  course,
  subjectColor,
  isCompleted = false,
  delay = 0,
  onClick,
}: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[8px] bg-card border border-border/50 cursor-pointer shadow-md hover:shadow-lg transition-all"
    >
      {/* Cover image or gradient */}
      <div className="relative h-32 overflow-hidden">
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${subjectColor}40, ${subjectColor}20)`,
            }}
          />
        )}

        {/* Play overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
          >
            <Play
              className="w-5 h-5 text-foreground ml-1"
              fill="currentColor"
            />
          </motion.div>
        </motion.div>

        {/* Completed badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500/90 text-white border-0 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Terminé
            </Badge>
          </div>
        )}

        {/* Video indicator */}
        {course.videoUrl && (
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="bg-black/60 text-white border-0 gap-1"
            >
              <Play className="w-3 h-3" />
              Vidéo
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h4>

        {course.content && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {course.content}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {course.documents && course.documents.length > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{course.documents.length} docs</span>
            </div>
          )}
          {course.quizzes && course.quizzes.length > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{course.quizzes.length} quiz</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
        style={{ backgroundColor: subjectColor }}
      />
    </motion.div>
  );
};
