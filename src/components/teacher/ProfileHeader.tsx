import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  role: string;
  department: string;
  avatarUrl?: string;
}

const ProfileHeader = ({ name, role, department, avatarUrl }: ProfileHeaderProps) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <div className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-4 ring-primary/10">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              {role}
            </Badge>
          </div>
          <p className="text-muted-foreground">{department}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
