"use client";
import { motion } from "framer-motion";
import {
  BookOpen,
  Flame,
  Play,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Target,
  Calendar,
  User,
  Settings,
  Search,
  Filter,
  ChevronRight,
  PlayCircle,
  FileText,
  Award,
  TrendingUp,
  Brain,
  Lightbulb,
  Zap,
  Heart,
  Users,
  MessageCircle,
  Download,
  Bookmark,
  ChevronsUpDown,
  LogOut,
  User2,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { WelcomeHeader } from "@/components/student/WelcomeHeader";
import { StatsCard } from "@/components/student/StatsCard";
import { ProgressRing } from "@/components/student/ProgressRing";
import { RecentActivity } from "@/components/student/RecentActivity";
import { Subject, Course, StudentStats } from "@/types/student";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSubjectProgress } from "@/actions/progress";
import QuizDisplay from "./quizzes";

const subjectIcons = [
  <Brain key="brain" className="w-8 h-8" />,
  <Zap key="zap" className="w-8 h-8" />,
  <Lightbulb key="lightbulb" className="w-8 h-8" />,
  <BookOpen key="bookopen" className="w-8 h-8" />,
  <Target key="target" className="w-8 h-8" />,
  <Award key="award" className="w-8 h-8" />,
  <TrendingUp key="trending" className="w-8 h-8" />,
  <Trophy key="trophy" className="w-8 h-8" />,
  <Heart key="heart" className="w-8 h-8" />,
  <Users key="users" className="w-8 h-8" />,
  <MessageCircle key="message" className="w-8 h-8" />,
  <Bookmark key="bookmark" className="w-8 h-8" />,
];

const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * subjectIcons.length);
  return subjectIcons[randomIndex];
};

// Composant pour une carte de matière
const SubjectCard = ({
  subject,
  userId, // Add userId as a prop
}: {
  subject: any;
  userId: string;
}) => {
  const [icon, setIcon] = useState<React.ReactNode>(null);

  // For random icons (different each time)
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const router = useRouter();
  useEffect(() => {
    const fetchProgress = async () => {
      setIcon(getRandomIcon());
      const progressData = await getSubjectProgress(userId, subject.id);
      setProgress(progressData);
    };

    fetchProgress();
  }, [userId, subject.id]);
  // For random icons (different each time)

  return (
    <motion.div
      onClick={() => router.push(`/dashboard/matiere/${subject.handler}`)}
      className="bg-white h-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group"
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header avec gradient */}
      <div
        className={` p-6 text-white relative overflow-hidden`}
        style={{
          background: `linear-gradient(to right, ${subject.color}, ${subject.color}cc)`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-[8px] backdrop-blur-sm">
              {icon || <div className="w-8 h-8" />}{" "}
              {/* Fallback while loading */}
            </div>
            <div>
              <h3 className="text-xl font-bold">{subject.name}</h3>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      {/* Contenu */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {subject?.courses?.length}
            </p>
            <p className="text-xs text-gray-500">Cours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {progress.completed}
            </p>
            <p className="text-xs text-gray-500">Terminés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {progress.percentage}%
            </p>
            <p className="text-xs text-gray-500">Progression</p>
          </div>
          {/*  */}
        </div>

        {/**/}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression globale</span>
            <span className="font-semibold text-gray-900">
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={` h-2 rounded-full`}
              style={{
                background: `linear-gradient(to right, ${subject.color}, ${subject.color}cc)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
      {/* Statistiques */}
    </motion.div>
  );
};

const mockRecentCourses: (Course & { subjectColor: string })[] = [
  {
    id: "1",
    title: "Les équations du premier degré",
    content: "Résolution et applications des équations linéaires",
    videoUrl: "https://example.com/video1",
    coverImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    handler: "equations-1",
    index: 1,
    subjectId: "1",
    documents: [{ id: "1", name: "Cours", url: "#", courseId: "1" }],
    quizzes: [{ id: "1", title: "Quiz 1", courseId: "1" }],
    createdAt: new Date().toISOString(),
    subjectColor: "#8B5CF6",
  },
  {
    id: "2",
    title: "La mécanique newtonienne",
    content: "Les lois de Newton et leurs applications",
    videoUrl: "https://example.com/video2",
    coverImage:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    handler: "mecanique-1",
    index: 1,
    subjectId: "2",
    documents: [],
    quizzes: [{ id: "2", title: "Quiz 1", courseId: "2" }],
    createdAt: new Date().toISOString(),
    subjectColor: "#3B82F6",
  },
  {
    id: "3",
    title: "Le texte argumentatif",
    content: "Structure et techniques de l'argumentation",
    handler: "argumentation-1",
    index: 1,
    subjectId: "3",
    documents: [{ id: "3", name: "Exercices", url: "#", courseId: "3" }],
    quizzes: [],
    createdAt: new Date().toISOString(),
    subjectColor: "#EC4899",
  },
  {
    id: "4",
    title: "Present Perfect Tense",
    content: "Usage and formation of the present perfect",
    videoUrl: "https://example.com/video4",
    handler: "present-perfect",
    index: 1,
    subjectId: "5",
    documents: [],
    quizzes: [{ id: "4", title: "Grammar Quiz", courseId: "4" }],
    createdAt: new Date().toISOString(),
    subjectColor: "#F59E0B",
  },
];

const mockStats: StudentStats = {
  totalCourses: 52,
  completedCourses: 31,
  totalQuizzes: 24,
  averageScore: 78,
  streak: 7,
  hoursLearned: 48,
};

export function formatDurationFromSeconds(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursPart = hours > 0 ? `${hours}h` : "";
  const minutesPart = minutes > 0 ? `${minutes}min` : "";
  const secondsPart = remainingSeconds > 0 ? `${remainingSeconds}s` : "";

  return `${hoursPart} ${minutesPart} ${secondsPart}`.trim();
}
const StudentDashboard = ({ user, quizzes, stats }: any) => {
  const navigate = useRouter();
  const hoursLearned = formatDurationFromSeconds(stats.totalStudyTime);
  const handleLogout = () => {
    signOut();
    toast.success("Déconnexion réussie");
  };
  const subjects = user.grade.subjects;
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage des matières
  const filteredSubjects = subjects.filter((subject: any) => {
    const matchesSearch = subject.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
  const [subjectsWithProgress, setSubjectsWithProgress] = useState<any>([]);
  useEffect(() => {
    const fetchAllProgress = async () => {
      const updated = await Promise.all(
        filteredSubjects.map(async (subject: any) => {
          const progress = await getSubjectProgress(user.id, subject.id);
          return { ...subject, progress };
        })
      );

      // Prevent re-render loop if data is the same
      setSubjectsWithProgress((prev: any) => {
        if (JSON.stringify(prev) === JSON.stringify(updated)) return prev;
        return updated;
      });
    };

    if (filteredSubjects.length > 0 && user?.id) {
      fetchAllProgress();
    }
  }, [filteredSubjects, user?.id]);

  const overallProgress = subjectsWithProgress.length
    ? Math.round(
        subjectsWithProgress.reduce(
          (acc: any, s: any) => acc + (s.progress?.percentage || 0),
          0
        ) / subjectsWithProgress.length
      )
    : 0;

  return (
    <div className="min-h-screen relative">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <WelcomeHeader
          studentName={user?.name || ""}
          gradeName={
            `${user?.grade?.niveau?.name} - ${user?.grade?.name}` || ""
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatsCard
            icon={BookOpen}
            label="Cours complétés"
            value={`${stats.completedCourses}/${stats.totalCourses}`}
            subtext="Continue comme ça!"
            color="bg-blue-600"
            delay={0.1}
          />
          <StatsCard
            icon={Trophy}
            label="Score moyen"
            value={`${stats.averageScore}%`}
            subtext="Aux quiz"
            color="bg-yellow-500"
            delay={0.2}
          />
          <StatsCard
            icon={Flame}
            label="Série en cours"
            value={`${user?.streak} jours`}
            subtext="Record: 12 jours"
            color="bg-orange-500"
            delay={0.3}
          />
          <StatsCard
            icon={Clock}
            label="Temps d'étude"
            value={`${hoursLearned}`}
            subtext="Ce mois"
            color="bg-green-500"
            delay={0.4}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Subjects & Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subjects Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div></div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center cursor-pointer gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={() => navigate.push("/dashboard/matiere")}
                >
                  Voir toutes les matières
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredSubjects
                  .slice(0, 2)
                  .map((subject: any, index: any) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SubjectCard subject={subject} userId={user.id} />
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Recent Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-semibold text-foreground font-display"
                ></motion.h2>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate.push("/dashboard/quizzes")}
                  className="flex items-center gap-1 text-sm cursor-pointer text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Tous les quizzes
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid-cols-1 w-full gap-4">
                <motion.div
                  key="courses-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuizDisplay quizzes={quizzes} userId={user.id} all={false} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Activity */}
          <div className="space-y-6">
            {/* Overall Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card border border-gray-300 shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-foreground font-display mb-6">
                Progression globale
              </h3>

              <div className="flex justify-center mb-6">
                <ProgressRing
                  progress={overallProgress}
                  size={140}
                  color="#0AEC7B"
                />
              </div>

              <div className="space-y-3">
                {subjectsWithProgress.slice(0, 4).map((subject: any) => (
                  <div key={subject.id} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />

                    <span className="flex-1 text-sm text-foreground truncate">
                      {subject.name}
                    </span>

                    <span className="text-sm font-medium text-muted-foreground">
                      {subject.progress?.percentage ?? 0}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <RecentActivity activities={user.activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
