import { useEffect, useState, useCallback } from "react";
import LiveCard from "./LiveCard";
import SearchBar from "./SearchBar";
import { UnlockedLive } from "@/actions/client";
import { toast } from "react-toastify";
import { UnlockCodeInput } from "./UnlockCodeInput";
import useEmblaCarousel from "embla-carousel-react";

import {
  Bell,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  Filter,
  KeyRound,
  MessageCircle,
  MessageSquare,
  Play,
  Send,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { StudentLiveCard } from "./StudentLiveCard";
import { useRouter } from "next/navigation";
import { StudentLiveCardWithTiming } from "./StudentLiveCardwithTiming";
const steps = [
  {
    number: 1,
    icon: CreditCard,
    title: "Effectuer le paiement",
    description:
      "Choisissez votre méthode de paiement préférée (CashPlus, Virement, Banque ou Espace).",
  },
  {
    number: 2,
    icon: Send,
    title: "Récupérer le reçu",
    description:
      "Gardez le reçu de transaction ou prenez une photo claire du ticket.",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "Envoyer via WhatsApp",
    description:
      "Envoyez la photo du reçu à notre administrateur via WhatsApp.",
  },
  {
    number: 4,
    icon: KeyRound,
    title: "Recevoir le code",
    description:
      "L&apos;administrateur vous enverra un code d&apos;accès unique.",
  },
  {
    number: 5,
    icon: CheckCircle,
    title: "Accéder aux cours",
    description: "Entrez le code reçu pour débloquer tous les cours live.",
  },
];

// RecordedLivesCarousel Component
const RecordedLivesCarousel = ({
  subjectId,
  recordedLives,
  userId,
  registeredLives,
  carouselRefs,
  setCarouselRefs,
  canScrollPrev,
  canScrollNext,
  updateScrollState,
  scrollPrev,
  scrollNext,
}: any) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
    },
  });

  useEffect(() => {
    if (emblaApi) {
      // Store the embla API instance for this subject
      setCarouselRefs((prev: any) => ({ ...prev, [subjectId]: emblaApi }));

      // Update scroll state initially and on select
      updateScrollState(subjectId, emblaApi);
      emblaApi.on("select", () => updateScrollState(subjectId, emblaApi));
      emblaApi.on("reInit", () => updateScrollState(subjectId, emblaApi));
    }
  }, [emblaApi, subjectId, setCarouselRefs, updateScrollState]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-muted-foreground">
            Lives enregistrés
          </div>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {recordedLives.length}
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollPrev(subjectId)}
            disabled={!canScrollPrev[subjectId]}
            className={`p-2 rounded-full transition-all ${
              canScrollPrev[subjectId]
                ? "bg-primary hover:bg-primary/70 text-white cursor-pointer"
                : "bg-secondary/30 text-muted-foreground/30 cursor-not-allowed"
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollNext(subjectId)}
            disabled={!canScrollNext[subjectId]}
            className={`p-2 rounded-full transition-all ${
              canScrollNext[subjectId]
                ? "bg-primary hover:bg-primary/70 text-white cursor-pointer"
                : "bg-secondary/30 text-muted-foreground/30 cursor-not-allowed"
            }`}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {recordedLives.map((room: any) => (
            <div
              key={room.id}
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-0.5rem)] min-w-0"
            >
              <StudentLiveCard
                isProgrammed={false}
                room={room}
                userId={userId}
                isRegistered={registeredLives.has(room.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LivesView = ({
  liveRooms,
  registeredLives,
  user,
  onTabChange,
  loading,
}: any) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Carousel state for recorded lives - stores carousel instances per subject
  const [carouselRefs, setCarouselRefs] = useState<{ [key: string]: any }>({});
  const [canScrollPrev, setCanScrollPrev] = useState<{
    [key: string]: boolean;
  }>({});
  const [canScrollNext, setCanScrollNext] = useState<{
    [key: string]: boolean;
  }>({});

  // Function to update scroll states for a specific subject
  const updateScrollState = useCallback((subjectId: string, emblaApi: any) => {
    if (!emblaApi) return;
    setCanScrollPrev((prev) => ({
      ...prev,
      [subjectId]: emblaApi.canScrollPrev(),
    }));
    setCanScrollNext((prev) => ({
      ...prev,
      [subjectId]: emblaApi.canScrollNext(),
    }));
  }, []);

  // Function to scroll to previous slide
  const scrollPrev = useCallback(
    (subjectId: string) => {
      const emblaApi = carouselRefs[subjectId];
      if (emblaApi) emblaApi.scrollPrev();
    },
    [carouselRefs],
  );

  // Function to scroll to next slide
  const scrollNext = useCallback(
    (subjectId: string) => {
      const emblaApi = carouselRefs[subjectId];
      if (emblaApi) emblaApi.scrollNext();
    },
    [carouselRefs],
  );

  // Get the next live session dynamically (earliest live or scheduled)
  const nextLive = (() => {
    const upcomingLives = [
      ...(liveRooms.live || []),
      ...(liveRooms.scheduled || []),
    ].filter(
      (room: any) => room.status === "LIVE" || room.status === "SCHEDULED",
    );

    if (upcomingLives.length === 0) return null;

    // Sort by startsAt to get the earliest one
    const sortedLives = upcomingLives.sort((a: any, b: any) => {
      const dateA = a.startsAt ? new Date(a.startsAt).getTime() : 0;
      const dateB = b.startsAt ? new Date(b.startsAt).getTime() : 0;
      return dateA - dateB;
    });

    return sortedLives[0];
  })();

  // Countdown timer effect - dynamic based on nextLive startsAt
  useEffect(() => {
    if (!nextLive?.startsAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(nextLive.startsAt).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextLive]);
  // Get all unique subjects from live rooms
  const allLiveRooms = [
    ...(liveRooms.live || []),
    ...(liveRooms.scheduled || []),
    ...(liveRooms.past || []),
  ];
  const uniqueSubjects = Array.from(
    new Map(
      allLiveRooms
        .filter((room: any) => room.subject)
        .map((room: any) => [room.subject.id, room.subject]),
    ).values(),
  );

  // Filter live rooms based on active category and search query
  const filteredLiveRooms = allLiveRooms.filter((room: any) => {
    // First filter by category (subject)
    const matchesCategory =
      activeCategory === "All" ||
      (room.subject && room.subject.id === activeCategory);

    // Then filter by search query (search in name and description)
    const matchesSearch =
      searchQuery === "" ||
      room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description &&
        room.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });
  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className="flex-1 lg:p-6 p-3 overflow-auto lg:pt-8 pt-[54px]">
      <div className="max-w-5xl">
        <div>
          <h1 className="lg:text-3xl text-2xl font-bold mb-4 flex items-center gap-2">
            Lives & Classrooms
          </h1>

          <p className="text-muted-foreground mb-8">
            Rejoignez des sessions en direct et des salles de classe
            interactives avec des instructeurs experts
          </p>
          {nextLive && (
            <div
              className="mb-8 relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 text-primary-foreground shadow-2xl"
              style={{
                backgroundImage: nextLive.image
                  ? `url(${nextLive.image})`
                  : "linear-gradient(to bottom right, hsl(var(--primary) / 0.9), hsl(var(--primary)), hsl(var(--primary) / 0.8))",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Background overlay - gradient changes direction based on screen size */}
              <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#1A3263]/90 via-[#1A3263]/40 to-transparent" />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-medium">
                        {nextLive.status === "LIVE" ? "EN DIRECT" : "Next Live"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">
                        {nextLive.startsAt
                          ? new Date(nextLive.startsAt).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              },
                            )
                          : "Date non définie"}
                      </span>
                      <span className="sm:hidden">
                        {nextLive.startsAt
                          ? new Date(nextLive.startsAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )
                          : "Date non définie"}
                      </span>
                    </div>
                    <span className="mx-1">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {nextLive.startsAt
                          ? new Date(nextLive.startsAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "--:--"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  {/* Left - Session Info */}
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2">
                      {nextLive.name}
                    </h2>
                    {nextLive.description && (
                      <p className="text-white/90 text-sm sm:text-base lg:text-lg line-clamp-2">
                        {nextLive.description}
                      </p>
                    )}

                    {/* Instructor */}
                    <div className="flex items-center gap-3 p-2 bg-black/50 rounded-2xl">
                      <img
                        src={
                          nextLive.teacher?.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            nextLive.teacher?.name || "Teacher",
                          )}&background=random`
                        }
                        alt={nextLive.teacher?.name || "Teacher"}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-base sm:text-lg">
                          {nextLive.teacher?.name || "Instructeur"}{" "}
                          {nextLive.teacher?.prenom || ""}
                        </p>
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {nextLive.participants?.length || 0} participant
                            {(nextLive.participants?.length || 0) !== 1
                              ? "s"
                              : ""}{" "}
                            inscrit
                            {(nextLive.participants?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    {nextLive.status === "LIVE" ? (
                      <Button
                        onClick={() =>
                          router.push(
                            nextLive.status === "LIVE"
                              ? `/dashboard/live/${nextLive.id}`
                              : `/dashboard/live/${nextLive.id}`,
                          )
                        }
                        className="group w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-red-600 text-white border-red-600 border-2 hover:bg-red-600 hover:text-white font-bold px-8 py-4 rounded-[8px] shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      >
                        <>
                          <Video className="w-5 h-5 group-hover:animate-pulse" />
                          Rejoindre le Live
                        </>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>

                  {/* Right - Countdown Timer */}
                  {nextLive.status !== "LIVE" && (
                    <div className="flex flex-col items-center lg:items-end">
                      <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider font-medium">
                        Commence dans
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Hours */}
                        <div className="flex flex-col items-center">
                          <div className="bg-black/20 backdrop-blur-md rounded-[8px] sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 min-w-[60px] sm:min-w-[70px] lg:min-w-[90px] text-center border border-white/10">
                            <span className="text-xl sm:text-2xl lg:text-4xl font-bold tabular-nums">
                              {formatTime(timeLeft.hours)}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-white uppercase tracking-wider">
                            Heures
                          </span>
                        </div>

                        <span className="text-2xl sm:text-3xl lg:text-4xl font-light opacity-50">
                          :
                        </span>

                        {/* Minutes */}
                        <div className="flex flex-col items-center">
                          <div className="bg-black/20 backdrop-blur-md rounded-[8px] sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 min-w-[60px] sm:min-w-[70px] lg:min-w-[90px] text-center border border-white/10">
                            <span className="text-xl sm:text-2xl lg:text-4xl font-bold tabular-nums">
                              {formatTime(timeLeft.minutes)}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-white uppercase tracking-wider">
                            Minutes
                          </span>
                        </div>

                        <span className="text-2xl sm:text-3xl lg:text-4xl font-light opacity-50">
                          :
                        </span>

                        {/* Seconds */}
                        <div className="flex flex-col items-center">
                          <div className="bg-black/20 backdrop-blur-md rounded-[8px] sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 min-w-[60px] sm:min-w-[70px] lg:min-w-[90px] text-center border border-white/10">
                            <span className="text-xl sm:text-2xl lg:text-4xl font-bold tabular-nums">
                              {formatTime(timeLeft.seconds)}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-white uppercase tracking-wider">
                            Secondes
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="w-full col-span-2">
              <div className="flex items-center justify-between gap-2 w-full">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher une session live..."
                />
              </div>
              <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
                <button
                  key={"All"}
                  onClick={() => setActiveCategory("All")}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === "All"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {"Tout"}
                </button>
                {uniqueSubjects.map((subject: any) => (
                  <button
                    key={subject.id}
                    onClick={() => setActiveCategory(subject.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeCategory === subject.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {loading ? (
            <div className="px-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-5 animate-pulse"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="h-5 w-16 rounded-full bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-7 w-20 rounded-full bg-muted" />
                    <div className="h-7 w-24 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : !user?.grades || user.grades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4 bg-secondary/20 rounded-3xl border border-dashed border-muted-foreground/20">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary shadow-inner">
                <GraduationCap className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-muted-foreground max-w-md mb-10 text-lg">
                Vous n&apos;avez pas encore de Norme assigné. Rejoignez
                l&apos;un de nos programmes pour débloquer vos sessions live et
                contenus exclusifs.
              </p>
              <Button
                onClick={() => router.push("/dashboard/courses")}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-16 py-2 h-auto text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                Parcourir les cours
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : filteredLiveRooms.length === 0 ? (
            <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border/50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-muted-foreground mb-6">
                Aucun live ne correspond à vos critères de recherche.
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="text-primary font-medium hover:underline flex items-center gap-2 mx-auto"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Live Rooms Section organized by Subject */}
              {!loading && (
                <div className="">
                  {/* Group lives by subject */}
                  {(() => {
                    // Group filtered rooms by subject
                    const roomsBySubject = filteredLiveRooms.reduce(
                      (acc: any, room: any) => {
                        const subjectId = room.subject?.id || "no-subject";
                        const subjectName =
                          room.subject?.name || "Sans matière";

                        if (!acc[subjectId]) {
                          acc[subjectId] = {
                            subject: room.subject || {
                              id: "no-subject",
                              name: "Sans matière",
                            },
                            upcomingLives: [],
                            recordedLives: [],
                          };
                        }

                        // Categorize rooms into upcoming (LIVE or SCHEDULED) and recorded (ENDED)
                        if (
                          room.status === "LIVE" ||
                          room.status === "SCHEDULED"
                        ) {
                          acc[subjectId].upcomingLives.push(room);
                        } else if (room.status === "ENDED") {
                          acc[subjectId].recordedLives.push(room);
                        }

                        return acc;
                      },
                      {},
                    );

                    // Sort upcoming lives by startsAt ascending
                    Object.values(roomsBySubject).forEach(
                      (subjectData: any) => {
                        subjectData.upcomingLives.sort((a: any, b: any) => {
                          const dateA = a.startsAt
                            ? new Date(a.startsAt).getTime()
                            : 0;
                          const dateB = b.startsAt
                            ? new Date(b.startsAt).getTime()
                            : 0;
                          return dateA - dateB;
                        });
                      },
                    );

                    // Sort recorded lives by endedAt descending (most recent first)
                    Object.values(roomsBySubject).forEach(
                      (subjectData: any) => {
                        subjectData.recordedLives.sort((a: any, b: any) => {
                          const dateA = a.endedAt
                            ? new Date(a.endedAt).getTime()
                            : 0;
                          const dateB = b.endedAt
                            ? new Date(b.endedAt).getTime()
                            : 0;
                          return dateB - dateA;
                        });
                      },
                    );

                    return Object.values(roomsBySubject).map(
                      (subjectData: any) => (
                        <div key={subjectData.subject.id} className="mb-8">
                          <div className="flex items-center gap-2 mb-4">
                            <div
                              className="w-1 h-6 rounded-full"
                              style={{
                                backgroundColor:
                                  subjectData.subject.color || "#3b82f6",
                              }}
                            />
                            <h2 className="text-xl font-bold">
                              {subjectData.subject.name}
                            </h2>
                          </div>

                          {/* Upcoming/Next Lives */}
                          {subjectData.upcomingLives.length > 0 && (
                            <div className="mb-6 space-y-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                  <Video className="w-4 h-4" />
                                  <span>Prochains Lives</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                {subjectData.upcomingLives.map((live: any) => (
                                  <StudentLiveCardWithTiming
                                    key={live.id}
                                    isProgrammed={true}
                                    room={live}
                                    userId={user.id}
                                    isRegistered={registeredLives.has(live.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recorded Lives */}
                          {subjectData.recordedLives.length > 0 && (
                            <RecordedLivesCarousel
                              subjectId={subjectData.subject.id}
                              recordedLives={subjectData.recordedLives}
                              userId={user.id}
                              registeredLives={registeredLives}
                              carouselRefs={carouselRefs}
                              setCarouselRefs={setCarouselRefs}
                              canScrollPrev={canScrollPrev}
                              canScrollNext={canScrollNext}
                              updateScrollState={updateScrollState}
                              scrollPrev={scrollPrev}
                              scrollNext={scrollNext}
                            />
                          )}

                          {/* Empty state for subject with no lives */}
                          {!subjectData.upcomingLives.length &&
                            subjectData.recordedLives.length === 0 && (
                              <div className="text-center py-8 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  Aucune session disponible pour cette matière
                                </p>
                              </div>
                            )}
                        </div>
                      ),
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivesView;
