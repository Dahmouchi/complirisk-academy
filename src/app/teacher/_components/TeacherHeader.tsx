"use client";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TeacherHeader() {
  const navigate = useRouter();
  const handleLogout = async () => {
    await signOut();
    navigate.push("/");
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/optimized/logoH.webp" className="w-24 h-auto" alt="" />
            <span className="hidden md:inline text-muted-foreground">
              | Espace Instructeur
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate.push("/teacher/dashboard")}
            >
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
