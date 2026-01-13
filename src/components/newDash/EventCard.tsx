import { Clock, Video, BookOpen, Sparkles, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  type: "webinar" | "lesson" | "task";
  title: string;
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
  description,
  date,
  time,
  variant = "card",
  isLocked = false,
  className,
}: EventCardProps) => {
  const variantClasses = {
    mint: "bg-mint",
    lavender: "bg-lavender",
    cream: "bg-cream",
    card: "bg-card",
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

  return (
    <div
      className={cn(
        "rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 animate-slide-in relative",
        variantClasses[variant],
        isLocked && "opacity-75",
        className
      )}
    >
      {/* Lock/Unlock Badge */}

      <div className="flex items-start justify-between mb-3 pr-16">
        <div className="flex items-center gap-2">
          {type === "webinar" && (
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop" />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          )}
          {type !== "webinar" && <Icon className="w-4 h-4" />}
          <span className="text-sm font-medium">{typeConfig[type].label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <p className={cn("text-sm mb-3 line-clamp-3", isLocked && "blur-[2px]")}>
        {description}
      </p>

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
