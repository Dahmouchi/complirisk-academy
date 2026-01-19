import {
  Star,
  BookOpen,
  Clock,
  FileQuestion,
  Play,
  Lock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id?: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  chapters?: number;
  quizzes?: number;
  hours?: number;
  price?: number;
  isFree?: boolean;
  isLive?: boolean;
  status?: "completed" | "watching" | "upcoming" | "locked";
  variant?: "accent" | "mint" | "lavender" | "cream" | "card";
  watchTime?: string;
  className?: string;
  onClick?: () => void;
}

const CourseCard = ({
  id,
  title,
  description,
  thumbnail,
  instructor,
  rating = 5,
  chapters = 0,
  quizzes = 0,
  hours = 0,
  price,
  isFree = true,
  isLive = false,
  status,
  variant = "card",
  watchTime,
  className,
  onClick,
}: CourseCardProps) => {
  const variantClasses = {
    accent: "bg-accent",
    mint: "bg-mint",
    lavender: "bg-lavender",
    cream: "bg-cream",
    card: "bg-card",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-3xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in cursor-pointer",
        variantClasses[variant],
        className
      )}
    >
      {/* Content */}
      <div className="p-2 grid grid-cols-5 gap-4">
        <div
          className="col-span-2 w-full h-full rounded-2xl "
          style={{
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="col-span-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {status === "locked" && (
                <Lock className="w-5 h-5 text-muted-foreground mb-2" />
              )}
              {variant === "accent" && status !== "locked" && !thumbnail && (
                <Sparkles className="w-5 h-5 text-accent-foreground/60 mb-2" />
              )}
            </div>
            {status !== "locked" && !thumbnail && (
              <button className="p-1 hover:bg-foreground/10 rounded-full transition-colors">
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2 leading-tight line-clamp-1">
            {title}
          </h3>

          {instructor && (
            <p className="text-sm text-muted-foreground mb-2">
              par {instructor}
            </p>
          )}

          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span> Chapitres</span>
            </div>

            <div className="flex items-center gap-1">
              <FileQuestion className="w-3.5 h-3.5" />
              <span> Quiz</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
