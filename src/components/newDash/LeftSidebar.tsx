import {
  BookOpen,
  Video,
  Menu,
  LayoutGrid,
  Bell,
  Plus,
  Minus,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LeftSidebarProps {
  activeTab: "courses" | "explore";
  onTabChange: (tab: "courses" | "explore") => void;
}

const LeftSidebar = ({ activeTab, onTabChange }: LeftSidebarProps) => {
  const router = useRouter();
  return (
    <>
      {/* Desktop: Vertical sidebar */}
      <div className="hidden bg-white md:flex flex-col items-center py-6 px-3 gap-4 h-full w-20 border-r border-border">
        {/* Free Courses Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className={cn(
            "w-12 h-12 rounded-[6px] transition-all duration-200",
            activeTab === "courses"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-blue-50 hover:bg-secondary",
          )}
        >
          <BookOpen className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/courses")}
          className={cn(
            "w-12 h-12 rounded-[6px] transition-all duration-200",
            activeTab === "explore"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-blue-50 hover:bg-secondary",
          )}
        >
          <Compass className="w-5 h-5" />
        </Button>

        {/* Lives & Classrooms Button 
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/live")}
          className={cn(
            "w-12 h-12 rounded-[6px] transition-all duration-200",
            activeTab === "lives"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-card hover:bg-secondary  box a",
          )}
        >
          <Video className="w-5 h-5" />
        </Button>*/}

        <div className="flex-1" />

        {/* Bottom controls */}
        <div className="flex items-center gap-1 bg-cream text-cream-foreground rounded-full px-2 py-1 text-sm font-medium">
          <Bell className="w-4 h-4" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-card hover:bg-secondary"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-card hover:bg-secondary"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default LeftSidebar;
