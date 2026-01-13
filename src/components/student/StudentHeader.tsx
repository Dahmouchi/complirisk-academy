"use client";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  ChevronDown,
  Home,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  Laptop,
  CheckCircle,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

interface StudentHeaderProps {
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
}

const mobileNavItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Cours", href: "/dashboard/matiere" },
  { icon: GraduationCap, label: "Quiz", href: "/dashboard/quizzes" },
  { icon: User, label: "Profil", href: "/dashboard/profile" },
];

export const StudentHeader = ({
  userName = "Étudiant",
  userAvatar,
  userEmail,
}: StudentHeaderProps) => {
  const navigate = useRouter();
  const location = usePathname();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    signOut();
    toast.success("Déconnexion réussie");
    navigate.push("/");
  };
  return (
    <>
      {/* Top Header */}
      <div className="flex bg-[#fbfaf6] items-center justify-between px-6 py-4  border-b border-gray-400/40 ">
        {/* Logo */}
        <div className="relative h-14 w-autoflex items-center justify-center ">
          <img src="/cinq/logoH.png" alt="" className=" h-10 w-auto" />
        </div>

        {/* Center Navigation */}
        <nav className=" lg:flex hidden items-center gap-2 bg-card rounded-full px-2 py-2 card-shadow">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center  gap-2 px-2 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="relative">
                  {!userAvatar && (
                    <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
                  )}
                  <Avatar className="w-10 h-10 border-2 border-gray-200">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold"> {userName}</p>
                  <p className="text-xs text-muted-foreground">Étudiant</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-blue-600/10 text-blue-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">Étudiant</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer relative"
              onClick={() => navigate.push("/dashboard/profile")}
            >
              {!userAvatar && (
                <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
              )}
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate.push("/dashboard/profile")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border/40 pb-safe"
      >
        <div className="flex items-center justify-around h-16">
          {mobileNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 h-0.5 w-12 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};
