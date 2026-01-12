"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/cinq/Header";
import { HeroBanner } from "@/components/cinq/HeroBanner";
import { CoursesSection } from "@/components/cinq/CoursesSection";
import { StudentLiveCard } from "@/components/cinq/StudentLiveCard";
import { freeCourses, liveCourses } from "@/data/cours";
import { getStudentLiveRooms, isUserRegistered } from "@/actions/live-room";
import { Video, Calendar, BookOpen } from "lucide-react";

type TabType = "cours" | "live";

const IndexCinq = ({ matieres, user }: any) => {
  const [activeTab, setActiveTab] = useState<TabType>("cours");
  const [liveRooms, setLiveRooms] = useState<any>({
    live: [],
    scheduled: [],
    past: [],
  });
  const [registeredLives, setRegisteredLives] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.registerCode && user?.id) {
      loadLiveRooms();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadLiveRooms = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const rooms = await getStudentLiveRooms(user.id);
      setLiveRooms(rooms);

      // Load registrations
      const allLives = [...rooms.live, ...rooms.scheduled];
      const registrations = await Promise.all(
        allLives.map((live) => isUserRegistered(live.id, user.id))
      );

      const registered = new Set(
        allLives
          .filter((_, index) => registrations[index])
          .map((live) => live.id)
      );
      setRegisteredLives(registered);
    } catch (error) {
      console.error("Error loading live rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-4">
      {/* Hero Banner - Only shown for non-registered users */}
      {!user.registerCode && <HeroBanner />}

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Cours Tab */}
            <button
              onClick={() => setActiveTab("cours")}
              className={`flex-1 w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm md:text-base transition-all duration-300 relative group ${
                activeTab === "cours"
                  ? "text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen
                className={`h-5 w-5 transition-transform duration-300 ${
                  activeTab === "cours" ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span>Cours Gratuit</span>
              {activeTab === "cours" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-in slide-in-from-bottom-1" />
              )}
            </button>

            {/* Live Tab - Only shown for registered users */}
            {user.registerCode && (
              <button
                onClick={() => setActiveTab("live")}
                className={`flex-1 w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm md:text-base transition-all duration-300 relative group ${
                  activeTab === "live"
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Video
                  className={`h-5 w-5 transition-transform duration-300 ${
                    activeTab === "live" ? "scale-110" : "group-hover:scale-105"
                  }`}
                />
                <span className="flex items-center gap-2">
                  Sessions Live
                  {liveRooms.live.length > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </span>
                {activeTab === "live" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-in slide-in-from-bottom-1" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="animate-in fade-in duration-500">
        {activeTab === "cours" ? (
          <div>
            {/* Free Courses Section */}
            <CoursesSection
              title="Cours Gratuit"
              description="Commencer votre parcours avec nos cours gratuits."
              courses={matieres}
              variant="free"
            />
          </div>
        ) : (
          <div>
            {/* Live Rooms Section - Only shown if user has registerCode */}
            {user.registerCode && !loading && (
              <div className="container mx-auto px-4 mb-12 mt-8">
                {/* Live Sessions */}
                {liveRooms.live.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <h2 className="text-2xl font-bold">Sessions en Direct</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {liveRooms.live.map((room: any) => (
                        <StudentLiveCard
                          key={room.id}
                          room={room}
                          userId={user.id}
                          isRegistered={registeredLives.has(room.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheduled Sessions */}
                {liveRooms.scheduled.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">
                        Sessions Programmées
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {liveRooms.scheduled.slice(0, 6).map((room: any) => (
                        <StudentLiveCard
                          key={room.id}
                          room={room}
                          userId={user.id}
                          isRegistered={registeredLives.has(room.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {liveRooms.live.length === 0 &&
                  liveRooms.scheduled.length === 0 && (
                    <div className="text-center py-16">
                      <Video className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Aucune session disponible
                      </h3>
                      <p className="text-muted-foreground">
                        Il n&apos;y a pas de sessions live pour le moment.
                        Revenez plus tard !
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/cinq/logoH.png" alt="" className="w-16 h:auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CinqCinq. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexCinq;
