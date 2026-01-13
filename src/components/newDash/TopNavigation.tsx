import { GraduationCap, Users, CheckCircle, Laptop, LayoutGrid, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopNavigation = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-tight">
        Learn<span className="text-accent-foreground">Hub</span>
      </div>

      {/* Center Navigation */}
      <nav className="flex items-center gap-2 bg-card rounded-full px-2 py-2 card-shadow">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm font-medium">Learning Plan</span>
        </div>
        
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <Users className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <Laptop className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
        </button>
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="w-10 h-10 border-2 border-accent">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
          <AvatarFallback>ET</AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-semibold">Sarah Johnson</p>
          <p className="text-xs text-muted-foreground">sarah@email.com</p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>
    </header>
  );
};

export default TopNavigation;
