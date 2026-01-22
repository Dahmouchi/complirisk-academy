"use client";
import { useEffect, useState } from "react";
import ProfileHeader from "@/components/teacher/ProfileHeader";
import QuickActions from "@/components/teacher/QuickActions";
import AnalyticsCards from "@/components/teacher/AnalyticsCards";
import CalendarView from "@/components/teacher/CalendarView";
import RecentCourses from "@/components/teacher/RecentCourses";
import LiveClassrooms from "@/components/teacher/LiveClassrooms";
import ActualitiesPanel from "@/components/teacher/ActualitiesPanel";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { updateStudentPicture } from "@/actions/student";

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

      {/* Main Content */}
      <main className="container-custom mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          name={user.name}
          prenom={user.prenom}
          role="Instructeur"
          department="chez Cinq Cinq Sup"
        />

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Actions rapides
          </h3>
          <QuickActions />
        </div>

        {/* Analytics 
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Statistiques
          </h3>
          <AnalyticsCards />
        </section>*/}

        {/* Live Classrooms & Actualities - New Dynamic Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveClassrooms userId={user.id} />
          <ActualitiesPanel userId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default Teacher;
