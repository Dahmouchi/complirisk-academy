import {
  BookOpen,
  Video,
  Menu,
  LayoutGrid,
  Bell,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  activeTab: "courses" | "lives";
  onTabChange: (tab: "courses" | "lives") => void;
}

const LeftSidebar = ({ activeTab, onTabChange }: LeftSidebarProps) => {
  return (
    <>
      {/* Mobile: Fixed top bar */}
      <div className="md:hidden fixed  left-0 right-0 z-50 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onTabChange("courses")}
            className={cn(
              "transition-all w-1/2 duration-200 gap-2 rounded-[8px]",
              activeTab === "courses"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-card hover:bg-secondary",
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cours</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => onTabChange("lives")}
            className={cn(
              "rounded-[8px] transition-all w-1/2 duration-200 gap-2",
              activeTab === "lives"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-card hover:bg-secondary box a",
            )}
          >
            <Video className="w-4 h-4" />
            <span>Lives</span>
          </Button>
        </div>
      </div>

      {/* Desktop: Vertical sidebar */}
      <div className="hidden md:flex flex-col items-center py-6 px-3 gap-4 h-full w-20 border-r border-border">
        {/* Free Courses Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("courses")}
          className={cn(
            "w-12 h-12 rounded-2xl transition-all duration-200",
            activeTab === "courses"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-card hover:bg-secondary",
          )}
        >
          <BookOpen className="w-5 h-5" />
        </Button>

        {/* Lives & Classrooms Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("lives")}
          className={cn(
            "w-12 h-12 rounded-2xl transition-all duration-200",
            activeTab === "lives"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-card hover:bg-secondary  box a",
          )}
        >
          <Video className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        {/* Additional controls */}
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-2xl bg-card hover:bg-secondary"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-2xl bg-card hover:bg-secondary"
        >
          <LayoutGrid className="w-5 h-5" />
        </Button>

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
