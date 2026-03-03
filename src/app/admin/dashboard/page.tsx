import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { DashboardCharts } from "../_components/dashboard-charts";
import { DashboardStats } from "../_components/dashboard-stats";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quickActions = [
    {
      title: "Créer une formation",
      description: "Créer une nouvelle formation",
      icon: PlayCircle,
      href: "/admin/dashboard/cours",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Créer un programme ISO",
      description: "",
      icon: BookOpen,
      href: "/admin/dashboard/matieres",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Planifier un séminaire live",
      description: "",
      icon: GraduationCap,
      href: "/admin/dashboard/classes",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Publier un insight / actualité",
      description: "",
      icon: TrendingUp,
      href: "/admin/dashboard/niveaux",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* En-tête du tableau de bord */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {currentDate}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Système en ligne
            </Badge>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vue d&apos;ensemble
        </h2>
        <DashboardStats />
      </div>
      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md h-full transition-shadow cursor-pointer border-l-4 border-l-gray-200 hover:border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Graphiques et visualisations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Analyses et Tendances
        </h2>
        <DashboardCharts />
      </div>

      {/* Pied de Page du tableau de bord */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}</p>
          <p>Plateforme d&apos;apprentissage - Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
