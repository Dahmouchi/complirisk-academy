"use client";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Edit2,
  Camera,
  Shield,
  Bell,
  Palette,
  FileText,
  X,
  Upload,
  GraduationCap,
  Award,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentHeader } from "@/components/student/StudentHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { formatDurationFromSeconds } from "@/app/(user)/_components/DashboardStudent";
import { useCallback, useRef, useState } from "react";
import { UpdateProfileForm } from "./UpdateProfileForm";
import { updateStudentPicture } from "@/actions/student";
import { BadgesDisplay } from "@/app/(user)/_components/BadgesDisplay";
import { Certificate, CertificateCard } from "./CertificateCard";

const mockUser = {
  id: "1",
  name: "Ahmed Benali",
  email: "ahmed.benali@email.com",
  phone: "+212 6 12 34 56 78",
  location: "Casablanca, Maroc",
  joinDate: "2024-09-01",
  avatar: "",
  niveau: "Collège",
  grade: "2AC",
  stats: {
    coursesCompleted: 24,
    quizzesPassed: 18,
    hoursLearned: 45,
    streak: 12,
    averageScore: 85,
    rank: 3,
  },
};

const achievements = [
  {
    id: "1",
    name: "Premier pas",
    description: "Compléter votre premier cours",
    icon: "🎯",
    earned: true,
  },
  {
    id: "2",
    name: "Studieux",
    description: "10 cours complétés",
    icon: "📚",
    earned: true,
  },
  {
    id: "3",
    name: "Quiz Master",
    description: "Score parfait sur 5 quiz",
    icon: "🏆",
    earned: true,
  },
  {
    id: "4",
    name: "Régulier",
    description: "7 jours consécutifs",
    icon: "🔥",
    earned: true,
  },
  {
    id: "5",
    name: "Expert",
    description: "50 cours complétés",
    icon: "⭐",
    earned: false,
  },
  {
    id: "6",
    name: "Légende",
    description: "Compléter tous les cours",
    icon: "👑",
    earned: false,
  },
];
// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: "CERT-2024-001",
    courseTitle: "Introduction à la programmation Python",
    completionDate: "2024-12-15",
    studentName: "Jean Dupont",
  },
  {
    id: "CERT-2024-002",
    courseTitle: "Développement Web avec React",
    completionDate: "2024-11-28",
    studentName: "Jean Dupont",
  },
  {
    id: "CERT-2024-003",
    courseTitle: "Base de données SQL avancées",
    completionDate: "2024-10-10",
    studentName: "Jean Dupont",
  },
];
export const FileUpload = ({
  onFileSelect,
  accept,
  multiple = false,
  label,
  description,
  currentFiles = [],
}: {
  onFileSelect: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  label: string;
  description: string;
  currentFiles?: File[];
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onFileSelect(newFiles);
    },
    [currentFiles, onFileSelect],
  );

  return (
    <div className="space-y-4">
      <Button
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        size="icon"
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Camera className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default function StudentProfile({ user, stats }: any) {
  const navigate = useRouter();
  const [image, setImage] = useState<File[]>([]);

  const handleSaveImage = async () => {
    try {
      const res = await updateStudentPicture(image[0], user.id);
      if (res) {
        toast.success("Image saved successfully");
        setImage([]);
        navigate.push("/dashboard/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    signOut();
    toast.success("Déconnexion réussie");
    navigate.push("/");
  };
  const hoursLearned = formatDurationFromSeconds(stats.totalStudyTime);

  const initials = user.name
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen">
      <main className="mx-auto lg:px-24 px-4 py-8 ">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Banner */}
          <div
            className="h-32 md:h-48 rounded-[6px] bg-gradient-to-r bg-cover bg-center from-blue-600 via-blue-600/80 to-blue-600/60 overflow-hidden relative"
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg)`,
            }}
          ></div>

          {/* Avatar & Info */}
          <div className="flex  flex-col md:flex-row items-center md:items-end gap-4 px-6 -mt-16 md:-mt-12">
            <motion.div className="relative" whileHover={{ scale: 1.05 }}>
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user?.image} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-blue-600-foreground text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <FileUpload
                onFileSelect={(files) => setImage(files)}
                accept="image/*"
                label="Changer d'avatar"
                description="Chercher une image"
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left md:pb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {user.name} {user?.prenom}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-600/10 text-blue-600"
                >
                  {user?.grade?.niveau?.name}
                </Badge>
                <Badge variant="outline">{user?.grade?.name}</Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 border-amber-500/30"
                >
                  🏆 Rang #{mockUser.stats.rank}
                </Badge>
              </div>
            </div>
            {image.length > 0 && (
              <Button
                className="gap-2 cursor-pointer bg-green-600 text-white"
                onClick={handleSaveImage}
              >
                <Edit2 className="h-4 w-4" />
                save picture
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info & Settings */}
          <div className="space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.verified_email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Inscrit le{" "}
                      {new Date(user?.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <Dialog>
                    {/* 1. Dialog Trigger (Your Button) */}
                    <DialogTrigger asChild className="">
                      <div className="w-full flex justify-end">
                        <div className="gap-2 w-fit flex cursor-pointer items-center justify-center bg-blue-600 text-white p-2 rounded-md">
                          <Edit2 className="h-4 w-4" />
                          Modifier le profil
                        </div>
                      </div>
                    </DialogTrigger>

                    {/* 2. Dialog Content */}
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Modifier le profil</DialogTitle>
                        <DialogDescription>
                          Mettez à jour les informations de votre profil.
                          Cliquez sur Sauvegarder une fois terminé.
                        </DialogDescription>
                      </DialogHeader>

                      {/* 3. The Form inside the Content */}
                      <UpdateProfileForm
                        userId={user.id}
                        initialData={{
                          name: user.name,
                          prenom: user.prenom,
                          phone: user.phone,
                          location: user.verified_email,
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings 
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mode sombre</span>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>*/}
          </div>

          {/* Middle Column - Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Cours terminés",
                      value: `${stats.completedCourses}/${stats.totalCourses}`,
                      icon: BookOpen,
                      color: "text-blue-500",
                    },
                    {
                      label: "Quiz réussis",
                      value: `${stats.averageScore}%`,
                      icon: Trophy,
                      color: "text-amber-500",
                    },
                    {
                      label: "Heures apprises",
                      value: `${hoursLearned}`,
                      icon: Clock,
                      color: "text-green-500",
                    },
                    {
                      label: "Série actuelle",
                      value: `${user.streak} jours`,
                      icon: Calendar,
                      color: "text-orange-500",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                      className="p-4 rounded-[8px] bg-muted/50 text-center"
                    >
                      <stat.icon
                        className={`h-6 w-6 mx-auto mb-2 ${stat.color}`}
                      />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Average Score
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          mockUser.stats.averageScore * 2.51
                        } 251`}
                        className="text-blue-600"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">
                      {mockUser.stats.averageScore}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Score moyen
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Achievements */}
          <BadgesDisplay />
        </div>
        {/* <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Certificats obtenus
            </h2>
            <Badge variant="secondary">
              {mockCertificates.length} certificat(s)
            </Badge>
          </div>
          
          {mockCertificates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Vous n&apos;avez pas encore de certificats.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Terminez un cours pour obtenir votre premier certificat !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                />
              ))}
            </div>
          )}
        </div>*/}
      </main>
    </div>
  );
}
