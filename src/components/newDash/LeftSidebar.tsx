import {
  BookOpen,
  Video,
  Menu,
  LayoutGrid,
  Bell,
  Plus,
  Minus,
  Compass,
  Globe2,
  Globe,
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className={cn(
            "w-12 h-12 rounded-[6px] transition-all duration-200 bg-blue-50 hover:bg-secondary",
          )}
        >
          <Globe className="w-5 h-5" />
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
      </div>
    </>
  );
};

export default LeftSidebar;
