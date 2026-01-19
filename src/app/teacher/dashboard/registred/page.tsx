"use client";
import {
  Video,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Play,
  Bell,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RegisteredLive {
  id: string;
  title: string;
  instructor: string;
  instructorImage: string;
  date: string;
  time: string;
  participants: number;
  status: "live" | "upcoming" | "completed";
  variant: "accent" | "mint" | "lavender" | "cream";
}

const StudentLives = () => {
  const navigate = useRouter();

  const registeredLives: RegisteredLive[] = [
    {
      id: "1",
      title: "Advanced Patient Assessment Techniques",
      instructor: "Dr. Emily Chen",
      instructorImage:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      date: "Today",
      time: "14:00",
      participants: 45,
      status: "live",
      variant: "accent",
    },
    {
      id: "2",
      title: "Clinical Decision Making Workshop",
      instructor: "Prof. James Miller",
      instructorImage:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
      date: "Tomorrow",
      time: "10:00",
      participants: 32,
      status: "upcoming",
      variant: "mint",
    },
    {
      id: "3",
      title: "Emergency Response Protocols",
      instructor: "Dr. Sarah Williams",
      instructorImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
      date: "Wed, 26.03",
      time: "15:30",
      participants: 28,
      status: "upcoming",
      variant: "lavender",
    },
    {
      id: "4",
      title: "Mental Health First Aid",
      instructor: "Dr. Michael Brown",
      instructorImage:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
      date: "Completed",
      time: "11:00",
      participants: 56,
      status: "completed",
      variant: "cream",
    },
  ];

  const getStatusBadge = (status: RegisteredLive["status"]) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-destructive text-destructive-foreground animate-pulse">
            <span className="w-2 h-2 bg-current rounded-full mr-1.5" />
            LIVE
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-mint text-mint-foreground">
            <Bell className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
    }
  };

  const variantClasses = {
    accent: "bg-accent",
    mint: "bg-mint",
    lavender: "bg-lavender",
    cream: "bg-cream",
  };

  const liveSessions = registeredLives.filter((l) => l.status === "live");
  const upcomingSessions = registeredLives.filter(
    (l) => l.status === "upcoming"
  );
  const completedSessions = registeredLives.filter(
    (l) => l.status === "completed"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate.push("/")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  My Live Sessions 🎬
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Your registered broadcasts and classrooms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
                <Video className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">
                  {liveSessions.length} Live Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 card-shadow text-center">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Video className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-2xl font-bold">{liveSessions.length}</p>
            <p className="text-xs text-muted-foreground">Live Now</p>
          </div>
          <div className="bg-card rounded-2xl p-4 card-shadow text-center">
            <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-mint-foreground" />
            </div>
            <p className="text-2xl font-bold">{upcomingSessions.length}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </div>
          <div className="bg-card rounded-2xl p-4 card-shadow text-center">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{completedSessions.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Live Now Section */}
        {liveSessions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              Happening Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSessions.map((live) => (
                <div
                  key={live.id}
                  className={cn(
                    "rounded-3xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300",
                    variantClasses[live.variant]
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-background">
                        <AvatarImage src={live.instructorImage} />
                        <AvatarFallback>{live.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{live.instructor}</h4>
                        <p className="text-xs text-muted-foreground">
                          Instructor
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(live.status)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{live.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{live.participants} watching</span>
                    </div>
                  </div>
                  <Button
                    className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => navigate.push(`/live/${live.id}`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Join Now
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Section */}
        {upcomingSessions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">📅 Upcoming Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingSessions.map((live) => (
                <div
                  key={live.id}
                  className={cn(
                    "rounded-3xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300",
                    variantClasses[live.variant]
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-background">
                        <AvatarImage src={live.instructorImage} />
                        <AvatarFallback>{live.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{live.instructor}</h4>
                        <p className="text-xs text-muted-foreground">
                          Instructor
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(live.status)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{live.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{live.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{live.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{live.participants}</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full" variant="secondary">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {completedSessions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              ✅ Completed Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedSessions.map((live) => (
                <div
                  key={live.id}
                  className="rounded-3xl p-5 bg-card border border-border card-shadow hover:card-shadow-hover transition-all duration-300 opacity-75"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-background">
                        <AvatarImage src={live.instructorImage} />
                        <AvatarFallback>{live.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{live.instructor}</h4>
                        <p className="text-xs text-muted-foreground">
                          Instructor
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(live.status)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{live.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{live.participants} attended</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Recording
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentLives;
