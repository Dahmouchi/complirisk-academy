"use client";
import { useEffect, useState } from "react";
import ProfileHeader from "@/components/teacher/ProfileHeader";
import QuickActions from "@/components/teacher/QuickActions";
import AnalyticsCards from "@/components/teacher/AnalyticsCards";
import CalendarView from "@/components/teacher/CalendarView";
import RecentCourses from "@/components/teacher/RecentCourses";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";

const Teacher = ({ user }: any) => {
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleLogout = async () => {
    await signOut();
    navigate.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.email?.split("@")[0] || "Instructeur";
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/cinq/logoH.png" className="w-24 h-auto" alt="" />
              <span className="hidden md:inline text-muted-foreground">
                | Espace Instructeur
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate.push("/")}
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

      {/* Main Content */}
      <main className="container-custom mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          name={formattedName}
          role="Instructeur"
          department="Département Génie Civil"
        />

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Actions rapides
          </h3>
          <QuickActions />
        </section>

        {/* Analytics */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Statistiques
          </h3>
          <AnalyticsCards />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarView />
          <RecentCourses />
        </div>
      </main>
    </div>
  );
};

export default Teacher;
