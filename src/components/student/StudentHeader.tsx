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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-gray-400/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-white"
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => navigate.push("/dashboard")}
          >
            <div className="relative h-14 w-autoflex items-center justify-center ">
              <img src="/cinq/logoH.png" alt="" className=" h-14 w-auto" />
            </div>
          </motion.div>

          {/* User Profile - Hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center  gap-2 px-2 hover:bg-muted/50"
              >
                <div className="relative">
                  {!userAvatar && (
                    <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
                  )}
                  <Avatar className="h-8 w-8 border-2 border-blue-600/20">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-blue-600/10 text-blue-600 text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="hidden md:inline-block text-sm font-medium">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-blue-600/10 text-blue-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">
                    Étudiant
                  </span>
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
      </motion.header>

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
