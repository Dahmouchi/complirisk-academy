import {
  Clock,
  Video,
  BookOpen,
  Sparkles,
  Lock,
  Unlock,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface EventCardProps {
  type: "webinar" | "lesson" | "task";
  title: string;
  author: string;
  image: string;
  role: string;
  description: string;
  date: string;
  time?: string;
  variant?: "mint" | "lavender" | "cream" | "card";
  isLocked?: boolean;
  className?: string;
}

const EventCard = ({
  type,
  title,
  author,
  image,
  role,
  description,
  date,
  time,
  variant = "card",
  isLocked = false,
  className,
}: EventCardProps) => {
  const variantClasses = {
    mint: "bg-yellow-50",
    lavender: "bg-purple-100",
    cream: "bg-blue-100",
    card: "bg-yellow-100",
  };

  const typeConfig = {
    webinar: {
      icon: Video,
      label: "Webinar",
    },
    lesson: {
      icon: BookOpen,
      label: "Lesson",
    },
    task: {
      icon: Sparkles,
      label: "Task",
    },
  };

  const Icon = typeConfig[type].icon;
  const [seeMore, setSeeMore] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 animate-slide-in relative",
        variantClasses[variant],
        isLocked && "opacity-75",
        className,
      )}
    >
      {/* Lock/Unlock Badge */}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {role === "TEACHER" ? (
            <Avatar className="w-6 h-6">
              <AvatarImage src={image} />
              <AvatarFallback>{author.slice(0, 2)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className="text-sm font-medium">
              {role === "TEACHER" ? author : "Cinq-Cinq"}
            </span>
            {role === "TEACHER" && (
              <p className="text-xs text-muted-foreground">Professeur</p>
            )}
            {role === "ADMIN" && (
              <p className="text-xs text-muted-foreground">Administrateur</p>
            )}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="mb-3">
        <p
          className={cn(
            "text-sm",
            isLocked && "blur-[2px]",
            !seeMore && "line-clamp-3",
          )}
        >
          {description}
        </p>
        {description && description.length > 90 && (
          <button
            onClick={() => setSeeMore(!seeMore)}
            className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer mt-1 font-medium transition-colors"
          >
            {seeMore ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>

      {time && (
        <div className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 w-fit">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Start at {time}</span>
        </div>
      )}

      {isLocked && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Upgrade to Pro to unlock
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCard;
