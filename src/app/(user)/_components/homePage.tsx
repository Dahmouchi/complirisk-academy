/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */

"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
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
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { completeCourse, getSubjectProgress } from "@/actions/progress";
import { toast } from "react-toastify";
import { getStudentStats } from "@/actions/client";
import QuizDisplay from "./quizzes";
import BadgeDropdown from "./badges";

// Types de données
interface Course {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  duration: string;
  lessonsCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor: string;
  rating: number;
  thumbnail: string;
  type: "video" | "quiz" | "assignment" | "reading";
}

interface Subject {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  courses: Course[];
  overallProgress: number;
  totalHours: string;
  completedCourses: number;
  category: string;
}

// Données d'exemple
const sampleSubjects: Subject[] = [
  {
    id: "1",
    title: "Mathématiques Avancées",
    description: "Algèbre linéaire, calcul différentiel et intégral",
    icon: <Brain className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600",
    totalHours: "45h",
    completedCourses: 8,
    overallProgress: 75,
    category: "Sciences",
    courses: [
      {
        id: "1-1",
        title: "Introduction aux matrices",
        description: "Concepts de base des matrices et opérations",
        status: "completed",
        progress: 100,
        duration: "2h 30min",
        lessonsCount: 12,
        difficulty: "beginner",
        instructor: "Dr. Martin Dubois",
        rating: 4.8,
        thumbnail: "/api/placeholder/300/200",
        type: "video",
      },
      {
        id: "1-2",
        title: "Déterminants et systèmes",
        description: "Calcul de déterminants et résolution de systèmes",
        status: "in-progress",
        progress: 60,
        duration: "3h 15min",
        lessonsCount: 15,
        difficulty: "intermediate",
        instructor: "Dr. Martin Dubois",
        rating: 4.9,
        thumbnail: "/api/placeholder/300/200",
        type: "video",
      },
      {
        id: "1-3",
        title: "Espaces vectoriels",
        description: "Théorie des espaces vectoriels et applications",
        status: "not-started",
        progress: 0,
        duration: "4h 00min",
        lessonsCount: 18,
        difficulty: "advanced",
        instructor: "Dr. Martin Dubois",
        rating: 4.7,
        thumbnail: "/api/placeholder/300/200",
        type: "video",
      },
    ],
  },
  {
    id: "2",
    title: "Physique Quantique",
    description: "Mécanique quantique et applications modernes",
    icon: <Zap className="w-8 h-8" />,
    color: "from-purple-500 to-pink-600",
    totalHours: "60h",
    completedCourses: 5,
    overallProgress: 45,
    category: "Sciences",
    courses: [
      {
        id: "2-1",
        title: "Principes fondamentaux",
        description: "Introduction à la mécanique quantique",
        status: "completed",
        progress: 100,
        duration: "3h 45min",
        lessonsCount: 20,
        difficulty: "intermediate",
        instructor: "Prof. Sarah Chen",
        rating: 4.9,
        thumbnail: "/api/placeholder/300/200",
        type: "video",
      },
    ],
  },
  {
    id: "3",
    title: "Intelligence Artificielle",
    description: "Machine Learning et Deep Learning",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "from-green-500 to-teal-600",
    totalHours: "80h",
    completedCourses: 12,
    overallProgress: 85,
    category: "Informatique",
    courses: [
      {
        id: "3-1",
        title: "Réseaux de neurones",
        description: "Architecture et entraînement des réseaux",
        status: "in-progress",
        progress: 40,
        duration: "5h 30min",
        lessonsCount: 25,
        difficulty: "advanced",
        instructor: "Dr. Alex Johnson",
        rating: 4.8,
        thumbnail: "/api/placeholder/300/200",
        type: "video",
      },
    ],
  },
];

// Composant pour les statistiques de l'étudiant
const StudentStats = ({ userId }: any) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const json = await getStudentStats(userId);
      setStats(json);
    };
    fetchStats();
  }, [userId]);

  if (!stats) return null;

  const cards = [
    {
      label: "Cours terminés",
      value: stats.completedCourses,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-500",
    },
    {
      label: "Heures d'étude",
      value: `${stats.studyHours}h`,
      icon: <Clock className="w-6 h-6" />,
      color: "text-blue-500",
    },

    {
      label: "Streak actuel",
      value: `${stats.streak} jours`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white rounded-[8px] p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} bg-gray-50 p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
const subjectIcons = [
  <Brain className="w-8 h-8" />,
  <Zap className="w-8 h-8" />,
  <Lightbulb className="w-8 h-8" />,
  <BookOpen className="w-8 h-8" />,
  <Target className="w-8 h-8" />,
  <Award className="w-8 h-8" />,
  <TrendingUp className="w-8 h-8" />,
  <Trophy className="w-8 h-8" />,
  <Heart className="w-8 h-8" />,
  <Users className="w-8 h-8" />,
  <MessageCircle className="w-8 h-8" />,
  <Bookmark className="w-8 h-8" />,
];

// Function to get a random icon
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

// Composant pour une carte de cours
const CourseCard = ({ course }: { course: Course }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-50";
      case "in-progress":
        return "text-blue-500 bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "in-progress":
        return "En cours";
      default:
        return "Non commencé";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-5 h-5" />;
      case "quiz":
        return <Target className="w-5 h-5" />;
      case "assignment":
        return <FileText className="w-5 h-5" />;
      case "reading":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-[8px] shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400">{getTypeIcon(course.type)}</div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {course.description}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  course.status,
                )}`}
              >
                {getStatusText(course.status)}
              </span>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessonsCount} leçons</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{course.rating}</span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                course.difficulty,
              )}`}
            >
              {course.difficulty}
            </span>
          </div>

          {/* Barre de progression */}
          {course.status !== "not-started" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Progression</span>
                <span className="font-semibold">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal de l'espace étudiant
const ModernStudentSpace = ({ user, quizzes }: any) => {
  const [selectedSubject, setSelectedSubject] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const subjects = user.grade.subjects;

  // Filtrage des matières
  const filteredSubjects = subjects.filter((subject: any) => {
    const matchesSearch = subject.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100"
      style={{
        backgroundImage: `url("/Board.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-8 inset-0 z-0 overflow-hidden h-44">
          <img
            src="/nav.png"
            className="w-full h-full object-cover"
            alt="Header background"
          />
          {/* Optional overlay if you need to darken the background */}
          <div className="absolute inset-0 bg-opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50 relative">
          <div className="flex items-center justify-between h-24">
            <img
              onClick={() => router.push("/dashboard")}
              src="/optimized/logoH.webp"
              className="h-auto w-30 lg:w-40 cursor-pointer"
              alt=""
            />

            <div className="flex items-center space-x-4 ">
              <div className="relative lg:block hidden">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une matière..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <motion.div
                className="relative group flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Glow effect */}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                {/* Inner glow */}
                <span className="absolute inset-0 border-2 border-white/20 rounded-lg group-hover:border-white/40 transition-all duration-300"></span>
                {/* Shadow animation */}
                <motion.span
                  className="absolute inset-0 rounded-lg shadow-lg pl-2"
                  initial={{
                    boxShadow:
                      "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                      "0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
                      "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  <BadgeDropdown user={user} size={"1"} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <div className="text-sm text-left">
                          <p className="font-medium">
                            {user?.name} {user?.prenom}
                          </p>
                          <div className="flex items-center space-x-1 text-gray-200 group-hover:text-white transition-colors">
                            <p>Profil</p>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard/profile")}
                        className="cursor-pointer"
                      >
                        <User2 />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="cursor-pointer"
                      >
                        <LogOut />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={"bar-container"}>
          {/* Background blobs */}
          <div className={"gradients-container"}>
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
          </div>

          {/* Foreground content */}
          <div
            className={"bar-content w-full flex items-center justify-center"}
          >
            <LayoutDashboard className="w-5 h-5 text-gray-500" />
            <div className="flex bg-gray-100 rounded-full p-1 gap-2">
              <button
                onClick={() => setSelectedSubject(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSubject
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Les matières
              </button>
              <button
                onClick={() => setSelectedSubject(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  !selectedSubject
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Filtres */}

          {selectedSubject ? (
            <motion.div
              key="subjects-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Statistiques  <StudentStats userId={user.id}/>*/}

              {/* Grille des matières */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject: any, index: any) => (
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
            </motion.div>
          ) : (
            <motion.div
              key="courses-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizDisplay quizzes={quizzes} userId={user.id} all={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernStudentSpace;
