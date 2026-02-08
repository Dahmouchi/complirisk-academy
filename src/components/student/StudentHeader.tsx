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
  Megaphone,
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
import { useEffect, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    {
      icon: GraduationCap,
      label: "1er au Maroc",
      description: "1er au Maroc",
    },
    {
      icon: Users,
      label: "+50K étudiants",
      description: "+50K étudiants",
    },
    {
      icon: CheckCircle,
      label: "Certifications",
      description: "Reconnu nationalement",
    },
    {
      icon: Laptop,
      label: "Platform 100% en ligne",
      description: "100% en ligne",
    },
    {
      icon: LayoutGrid,
      label: "+200 formations",
      description: "+200 formations",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev: any) => (prev + 1) % navItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* Top Header */}
      <div className="flex bg-[#ffffff] items-center justify-between px-6 py-2  border-b border-gray-400/40 ">
        {/* Logo */}
        <div
          onClick={() => navigate.push("/dashboard")}
          className="relative h-14 cursor-pointer w-auto flex items-center justify-center"
        >
          <img src="/compli/logo.png" alt="" className=" lg:h-10 h-14 w-auto" />
        </div>

        {/*<nav className="lg:flex hidden items-center gap-2 bg-white backdrop-blur-lg rounded-full px-4 shadow py-2  border border-white/20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-full transition-all duration-500 ease-out ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 min-w-[150px]"
                    : "p-2 hover:bg-white/10"
                }`}
                style={{
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon
                    className={`transition-all duration-500 ${
                      isActive ? "w-4 h-4 text-white" : "w-5 h-5 text-slate-400"
                    }`}
                    style={{
                      transform: isActive ? "rotate(360deg)" : "rotate(0deg)",
                    }}
                  />

                  <div
                    className={`flex flex-col items-start transition-all duration-500 ${
                      isActive
                        ? "opacity-100 max-w-[200px]"
                        : "opacity-0 max-w-0"
                    }`}
                    style={{
                      width: isActive ? "auto" : "0",
                      overflow: "hidden",
                    }}
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full"
                    style={{
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>

         User Profile */}
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
          <DropdownMenuContent align="end" className="w-56 rounded-[6px]">
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
              onClick={() => navigate.push("/dashboard/actualites")}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Mes annonces</span>
            </DropdownMenuItem>
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

      {/* Mobile Bottom Navigation 
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
      </motion.nav>*/}
    </>
  );
};
