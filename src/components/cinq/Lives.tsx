"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStudentLiveRooms,
  getCalendarLiveRooms,
  isUserRegistered,
} from "@/actions/live-room";
import { StudentLiveCard } from "./StudentLiveCard";
import { LiveCalendar } from "./LiveCalendar";
import { LiveDetailsModal } from "./LiveDetailsModal";
export default function StudentLivesPage() {
  const { data: session, status } = useSession();
  const [liveRooms, setLiveRooms] = useState<any>({
    live: [],
    scheduled: [],
    past: [],
  });
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [registeredLives, setRegisteredLives] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
    if (session?.user && session.user.role !== "USER") {
      redirect("/dashboard");
    }

    if (session?.user) {
      loadData();
    }
  }, [session, status]);
  const loadData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const [rooms, calendar] = await Promise.all([
        getStudentLiveRooms(session.user.id),
        getCalendarLiveRooms(
          session.user.id,
          new Date().getMonth(),
          new Date().getFullYear()
        ),
      ]);

      setLiveRooms(rooms);
      setCalendarEvents(calendar);

      // Charger les inscriptions
      const allLives = [...rooms.live, ...rooms.scheduled];
      const registrations = await Promise.all(
        allLives.map((live) => isUserRegistered(live.id, session.user.id))
      );

      const registered = new Set(
        allLives
          .filter((_, index) => registrations[index])
          .map((live) => live.id)
      );
      setRegisteredLives(registered);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  if (!session?.user) {
    return null;
  }
  const allSubjects = Array.from(
    new Set([
      ...liveRooms.live.map((r: any) => r.subject.name),
      ...liveRooms.scheduled.map((r: any) => r.subject.name),
    ])
  );
  const filterLives = (lives: any[]) => {
    return lives.filter((live) => {
      const matchesSearch =
        searchQuery === "" ||
        live.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        live.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        subjectFilter === "all" || live.subject.name === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  };
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Sessions Live
          </h1>
          <p className="text-muted-foreground mt-1">
            Rejoignez les cours en direct de vos professeurs
          </p>
        </div>
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un live..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Toutes les matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {allSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            En Direct
            {liveRooms.live.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {liveRooms.live.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Clock className="h-4 w-4" />
            Programmés
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        {/* Tous les lives */}
        <TabsContent value="all" className="space-y-6">
          {liveRooms.live.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-semibold">En Direct Maintenant</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterLives(liveRooms.live).map((room: any) => (
                  <StudentLiveCard
                    key={room.id}
                    room={room}
                    userId={session.user.id}
                    isRegistered={registeredLives.has(room.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {liveRooms.scheduled.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">À Venir</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterLives(liveRooms.scheduled)
                  .slice(0, 6)
                  .map((room: any) => (
                    <StudentLiveCard
                      key={room.id}
                      room={room}
                      userId={session.user.id}
                      isRegistered={registeredLives.has(room.id)}
                    />
                  ))}
              </div>
            </div>
          )}

          {liveRooms.live.length === 0 && liveRooms.scheduled.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun live disponible
                </h3>
                <p className="text-muted-foreground text-center">
                  Il n&apos;y a pas de sessions programmées pour le moment.
                  <br />
                  Revenez plus tard !
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Lives en direct */}
        <TabsContent value="live" className="space-y-4">
          {liveRooms.live.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterLives(liveRooms.live).map((room: any) => (
                <StudentLiveCard
                  key={room.id}
                  room={room}
                  userId={session.user.id}
                  isRegistered={registeredLives.has(room.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun live en cours
                </h3>
                <p className="text-muted-foreground">
                  Il n&apos;y a pas de session en direct pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Lives programmés */}
        <TabsContent value="scheduled" className="space-y-4">
          {liveRooms.scheduled.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterLives(liveRooms.scheduled).map((room: any) => (
                <StudentLiveCard
                  key={room.id}
                  room={room}
                  userId={session.user.id}
                  isRegistered={registeredLives.has(room.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun live programmé
                </h3>
                <p className="text-muted-foreground">
                  Il n&apos;y a pas de session programmée pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Calendrier */}
        <TabsContent value="calendar">
          <LiveCalendar
            events={calendarEvents}
            onEventClick={handleEventClick}
          />
        </TabsContent>
      </Tabs>

      {/* Modal détails */}
      <LiveDetailsModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        userId={session.user.id}
        isRegistered={
          selectedEvent ? registeredLives.has(selectedEvent.id) : false
        }
      />
    </div>
  );
}
