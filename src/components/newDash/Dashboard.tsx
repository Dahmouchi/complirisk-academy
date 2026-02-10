"use client";
import { useEffect, useMemo, useState } from "react";
import LeftSidebar from "@/components/newDash/LeftSidebar";
import CoursesView from "@/components/newDash/CoursesView";
import EventsPanel from "@/components/newDash/EventsPanel";
import { CourseCard } from "@/app/(user)/_components/compli/CourseCard";
import { CategoryFilter } from "@/app/(user)/_components/compli/CategoryFilter";
import { StatCard } from "@/app/(user)/_components/compli/StatCard";
import { categories, courses, freeCourses } from "@/data/courses";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Loader2,
  TrendingUp,
  Search,
  X,
} from "lucide-react";
import { UpcomingDeadlines } from "@/app/(user)/_components/compli/UpcomingDeadlines";
import { RecentActivity } from "@/app/(user)/_components/compli/RecentActivity";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDurationFromSeconds } from "@/app/(user)/_components/DashboardStudent";
import { Input } from "../ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import NewFormationPanel from "./NewFormationPanel";
import Progress from "../ui/progress";

const IndexNewDash = ({
  matieres,
  user,
  stats,
  recentActivities,
  allGrades,
  subjectProgress = {},
}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [courseType, setCourseType] = useState<"free" | "paid">("paid");
  const [bannerVisible, setBannerVisible] = useState(true);
  // Check if user is verified - needs BOTH verified status AND approved subscription
  const hasVerifiedStatus =
    user.StatutUser === "verified" || user.StatutUser === "subscribed";

  const hasApprovedSubscription = user.demandeInscription?.some(
    (demande: any) => demande.status === "APPROVED",
  );

  const isVerified = hasVerifiedStatus && hasApprovedSubscription;

  const pendingDemande = useMemo(() => {
    return user.demandeInscription?.find((d: any) => d.status === "PENDING");
  }, [user.demandeInscription]);

  const filteredGrades = useMemo(() => {
    return matieres
      .filter((grade: any) => {
        return (
          selectedCategory === "All Courses" || grade.name === selectedCategory
        );
      })
      .map((grade: any) => {
        const filteredSubjects = grade.subjects
          ?.map((subject: any) => {
            const dynamicCourses = subject.courses?.filter((course: any) => {
              const matchesSearch = course.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

              // If user is not verified, only show free courses
              if (!isVerified) {
                return matchesSearch && course.isFree;
              }

              // If user is verified, apply the normal filter
              const matchesType = courseType === "free" ? course.isFree : true;
              return matchesSearch && matchesType;
            });
            return { ...subject, courses: dynamicCourses };
          })
          .filter(
            (subject: any) => subject.courses && subject.courses.length > 0,
          );

        return { ...grade, subjects: filteredSubjects };
      })
      .filter((grade: any) => grade.subjects && grade.subjects.length > 0);
  }, [matieres, searchQuery, selectedCategory, courseType, isVerified]);
  const hoursLearned = formatDurationFromSeconds(stats.totalStudyTime);

  const gradeNames = useMemo<string[]>(() => {
    if (!matieres) return [];
    return Array.from(
      new Set(matieres.map((grade: any) => grade.name as string)),
    );
  }, [matieres]);

  const [activeTab, setActiveTab] = useState<"courses" | "explore">("courses");
  return (
    <div className="min-h-screen overflow-hidden pb-[50px]">
      {/* Left Sidebar */}
      <div className="flex h-[calc(100vh-80px)] pt-[14px] md:pt-0 ">
        {/* Left Sidebar - Desktop only */}
        <aside className="w-20 border-r border-border hidden md:block">
          <div className="h-full">
            <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </aside>
        <div className="space-y-8 p-4 overflow-y-scroll w-full">
          {/* Welcome Section */}
          {!isVerified && bannerVisible && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-[8px] p-2">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-blue-700 text-center dark:text-blue-300">
                    {!hasApprovedSubscription
                      ? "Votre demande d'inscription est en cours de traitement. Vous ne pouvez accéder qu'aux cours gratuits en attendant l'approbation de votre demande."
                      : "Votre compte n'est pas encore vérifié. Vous ne pouvez accéder qu'aux cours gratuits. Contactez l'administration pour obtenir l'accès complet à tous les cours."}
                  </p>
                </div>
                <button
                  onClick={() => setBannerVisible(false)}
                  className="text-blue-700 dark:text-blue-300"
                >
                  <X />
                </button>
              </div>
            </div>
          )}
          <div className="animate-slide-up">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Bonjour {user.name}! 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Continuez votre parcours d&apos;apprentissage en conformité. Vous
              faites de grands progrès!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="tous les cours"
              value={stats.totalCourses}
              subtitle="Continuez!"
              icon={BookOpen}
              variant="primary"
            />
            <StatCard
              title="cours terminés"
              value={stats.completedCourses}
              subtitle="Bravo!"
              icon={Award}
              variant="success"
            />
            <StatCard
              title="heures d'apprentissage"
              value={hoursLearned}
              subtitle="heures investies"
              icon={Clock}
            />
            <StatCard
              title="Certifications"
              value={2}
              subtitle="Certificats actifs"
              icon={TrendingUp}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Courses Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Verification Notice for Unverified Users */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Continuez à apprendre
                </h2>
                <ToggleGroup
                  type="single"
                  value={courseType}
                  onValueChange={(value) => {
                    if (value) {
                      setCourseType(value as "free" | "paid");
                      setSelectedCategory("All Courses");
                    }
                  }}
                  className="bg-muted p-1 rounded-lg"
                >
                  <ToggleGroupItem
                    value="paid"
                    className="data-[state=on]:bg-primary lg:w-fit w-full data-[state=on]:text-primary-foreground px-4 py-2 rounded-md transition-all"
                  >
                    Cours Payants
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="free"
                    className="data-[state=on]:bg-success lg:w-fit w-full data-[state=on]:text-white px-4 py-2 rounded-md transition-all"
                  >
                    Cours Gratuits
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
                <CategoryFilter
                  categories={["All Courses", ...gradeNames]}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {courseType === "paid" && pendingDemande && (
                <Card className="border-warning/30 bg-white mb-6">
                  <CardHeader className="pb-3">
                    <div className="flex lg:flex-row flex-col lg:items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-warning animate-spin" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          Votre demande est en cours de traitement
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Nous examinons votre demande d&apos;accès aux cours.
                          Vous serez notifié par email une fois approuvé.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-muted-foreground">
                          Demande reçue
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-warning animate-spin" />
                        <span className="text-muted-foreground">
                          Vérification en cours
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-50">
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        <span className="text-muted-foreground">
                          Accès accordé
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-6">
                {filteredGrades.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No {courseType} courses found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredGrades.map((grade: any, gradeIndex: any) => (
                      <div key={grade.id} className="space-y-4">
                        {grade.subjects?.map(
                          (subject: any, subjectIndex: any) => {
                            const progressCount = subjectProgress[
                              subject.id
                            ] || { completed: 0, total: 0, percentage: 0 };
                            return (
                              <div key={subject.id}>
                                <Collapsible
                                  className="group w-full rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md"
                                  defaultOpen={
                                    gradeIndex === 0 && subjectIndex === 0
                                  }
                                >
                                  <CollapsibleTrigger className="w-full relative flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4 w-full">
                                      <div
                                        className="w-1.5 h-12 rounded-full shadow-sm"
                                        style={{
                                          backgroundColor:
                                            subject.color || "#3b82f6",
                                        }}
                                      />
                                      <div className="lg:w-1/2 w-full">
                                        <h3 className="font-display text-lg font-bold text-foreground">
                                          {subject.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {subject.courses?.length || 0} Modules
                                          available
                                        </p>

                                        {progressCount !== undefined &&
                                          progressCount.total > 0 && (
                                            <div className="flex items-center gap-2 w-full">
                                              <Progress
                                                value={progressCount.percentage}
                                                className="h-1.5 bg-primary-foreground/30 w-full"
                                              />
                                              <div className="flex items-center justify-between text-xs mb-1">
                                                <span></span>
                                                <span>
                                                  {progressCount.percentage}%
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge
                                        variant="outline"
                                        className="hidden sm:inline-flex bg-muted/30 text-[10px] font-medium uppercase tracking-wider"
                                      >
                                        {grade.name}
                                      </Badge>
                                      <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center transition-transform duration-300 group-data-[state=open]:rotate-180">
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="animate-slide-down">
                                    <div className="p-5 pt-0">
                                      <div className="grid gap-6 md:grid-cols-2 mt-4">
                                        {subject.courses?.map(
                                          (dbCourse: any, courseIndex: any) => (
                                            <div
                                              key={dbCourse.id}
                                              style={{
                                                animationDelay: `${courseIndex * 50}ms`,
                                              }}
                                              className="animate-fade-in"
                                            >
                                              <CourseCard
                                                course={
                                                  {
                                                    id: dbCourse.id,
                                                    title: dbCourse.title,
                                                    description:
                                                      dbCourse.content || "",
                                                    category: subject.name,
                                                    duration: "8 hours",
                                                    lessons:
                                                      dbCourse.quizzes
                                                        ?.length || 0,
                                                    enrolled: 0,
                                                    progress:
                                                      dbCourse.progress?.find(
                                                        (p: any) =>
                                                          p.userId === user.id,
                                                      )?.completed
                                                        ? 100
                                                        : 0,
                                                    level: grade.name as any,
                                                    isFree: dbCourse.isFree,
                                                    subjectId: subject.id,
                                                    image:
                                                      dbCourse.coverImage ||
                                                      "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&auto=format&fit=crop&q=60",
                                                    instructor: "Expert",
                                                    price: dbCourse.isFree
                                                      ? 0
                                                      : 1500,
                                                  } as any
                                                }
                                              />
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <NewFormationPanel
                availableGrades={allGrades || []}
                userId={user.id}
                userGrades={user.grades || []}
                pendingDemande={pendingDemande}
              />
              {/*<EventsPanel registeredUser={user.registerCode} />
              <RecentActivity activities={recentActivities} />*/}
            </div>
          </div>
        </div>
        {/* Main Content 
        <CoursesView
          onTabChange={setActiveTab}
          matieres={matieres}
          registeredUser={user.registerCode}
        />*/}
        {/* Right Events Panel 
        <aside className="w-96 p-4 hidden lg:block">
        <UpcomingDeadlines />
          <EventsPanel registeredUser={user.registerCode} />
        </aside>*/}
      </div>
    </div>
  );
};

export default IndexNewDash;
