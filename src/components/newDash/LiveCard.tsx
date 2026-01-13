import { Video, Users, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface LiveCardProps {
  title: string;
  instructor: string;
  instructorImage: string;
  date: string;
  time: string;
  participants: number;
  isLive?: boolean;
  variant?: "accent" | "mint" | "lavender" | "cream" | "card";
  className?: string;
}

const LiveCard = ({
  title,
  instructor,
  instructorImage,
  date,
  time,
  participants,
  isLive = false,
  variant = "card",
  className,
}: LiveCardProps) => {
  const variantClasses = {
    accent: "bg-accent",
    mint: "bg-mint",
    lavender: "bg-lavender",
    cream: "bg-cream",
    card: "bg-card",
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-background">
            <AvatarImage src={instructorImage} />
            <AvatarFallback>{instructor[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{instructor}</h4>
            <p className="text-xs text-muted-foreground">Instructor</p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium animate-pulse">
            <span className="w-2 h-2 bg-current rounded-full" />
            LIVE
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{participants}</span>
        </div>
      </div>

      <Button
        className={cn(
          "w-full rounded-full",
          isLive
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        <Video className="w-4 h-4 mr-2" />
        {isLive ? "Join Now" : "Set Reminder"}
      </Button>
    </div>
  );
};

export default LiveCard;
