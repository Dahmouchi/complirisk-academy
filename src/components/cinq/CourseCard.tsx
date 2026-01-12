import { Star, BookOpen, Clock, FileQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  title: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  chapters: number;
  quizzes: number;
  hours: number;
  price?: number;
  isFree?: boolean;
  isLive?: boolean;
}

export function CourseCard({ cour }: any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/cours/${cour?.id}`)}
      className="group bg-card cursor-pointer rounded-2xl overflow-hidden card-hover border shadow-sm border-border/50"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={cour?.coverImage}
          alt={cour?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="destructive" className="text-xs rounded-full">
            Gratuit
          </Badge>
          {cour?.isLive && (
            <Badge variant="default" className="text-xs">
              <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full mr-1.5 animate-pulse"></span>
              LIVE
            </Badge>
          )}
          {cour?.isFree ? (
            <Badge variant="default" className="text-xs rounded-full">
              Free
            </Badge>
          ) : cour?.price ? (
            <Badge variant="default" className="text-xs rounded-full">
              {cour?.price.toFixed(2)} MAD
            </Badge>
          ) : null}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">5</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {cour?.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {cour?.content}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Chapitres</span>
          </div>
          <div className="flex items-center gap-1">
            <FileQuestion className="h-3.5 w-3.5" />
            <span>Quiz</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
