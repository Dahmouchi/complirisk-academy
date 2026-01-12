/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Award,
  Star,
  Edit,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Stars,
  Clock1,
} from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LogOut, PowerOffIcon, User, User2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Progress from "@/components/ui/progress";
import { StatutUser, UserStats } from "@/types/product";
import BadgeDropdown from "./badges";
const Profile = ({ user }: any) => {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const mockStats: UserStats = {
          totalCourses: 12,
          completedCourses: 8,
          totalQuizzes: 24,
          averageScore: 16.8,
          totalTimeSpent: 45.5, // heures
          currentStreak: 7,
          rank: 3,
          totalStudentsInGrade: 28,
        };

        setUserStats(mockStats);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name?: string, prenom?: string) => {
    const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : "";
    const lastInitial = name ? name.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}` || "U";
  };
  function formatDurationFromSeconds(seconds: number): string {
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hoursPart = hours > 0 ? `${hours}h` : "";
    const minutesPart = minutes > 0 ? `${minutes}min` : "";
    const secondsPart = remainingSeconds > 0 ? `${remainingSeconds}s` : "";

    return `${hoursPart} ${minutesPart} ${secondsPart}`.trim();
  }

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url("/Board.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="   relative">
        <div className="absolute -top-8 inset-0 z-0 overflow-hidden">
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
              src="/cinq/logoH.png"
              className="h-auto w-30 lg:w-40 cursor-pointer"
              alt=""
            />

            <div className="flex items-center space-x-4 bg-white">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer bg-white">
                    <User className="w-8 h-8 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {user?.name} {user?.prenom}
                      </p>
                      <p className="text-gray-500">Étudiante</p>
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
          </div>
        </div>
      </div>
      <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
        {/* En-tête du profil */}
        <div className="mb-8 bg-white  p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="">
                <BadgeDropdown size={"0"} user={user} />
              </div>
              <div>
                <h1 className="lg:text-3xl text-xl font-bold text-gray-900">
                  {user.prenom} {user.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {user.grade?.name} - {user.grade?.niveau.name}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center lg:items-start jusctify-between">
            <span className="text-gray-600">
              Le temps passé sur la plateforme
            </span>
            <div className="flex items-center justify-cente gap-2 xsm:flex-row">
              <div className="flex items-center gap-3 mt-2">
                {/* Time display */}
                <div className="flex items-center gap-1 py-1 px-3 rounded-full bg-green-400 text-white font-semibold shadow-md transform transition-transform duration-300 hover:scale-105">
                  <Clock className="w-4 h-4" />
                  {formatDurationFromSeconds(Number(user?.totalTimeSpent))}
                </div>

                {/* Badge based on hours */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Colonne de gauche - Informations personnelles */}
          <div className="space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Nom d&apos;utilisateur
                    </p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-gray-600">+{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.age && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Âge</p>
                      <p className="text-sm text-gray-600">{user.age} ans</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Membre depuis</p>
                    <p className="text-sm text-gray-600">
                      {user.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
