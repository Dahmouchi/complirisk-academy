"use client";

import { Play, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function HeroBanner() {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="mx-auto  relative z-10">
        <div className="">
          {/* Left content */}
          <div className="relative text-primary-foreground bg-blue-600 p-8 rounded-2xl space-y-6 col-span-4">
            {/* Background image - removed z-index */}
            <div
              style={{
                backgroundImage: "url('/optimized/items2.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-50 pointer-events-none"
            ></div>

            {/* Content with proper z-index */}
            <div className="relative z-10 space-y-3">
              <Badge
                variant="default"
                className="text-sm px-4 py-1.5 rounded-full bg-red-600"
              >
                <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
                Sessions EN DIRECT Disponibles
              </Badge>

              <h1 className="text-3xl md:text-4xl text-white lg:text-5xl font-bold leading-tight">
                Apprenez avec des Professeurs Experts en Temps Réel
              </h1>

              {/* Removed z-50 from this div as it's not needed */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  onClick={() => {
                    router.push("/dashboard/live");
                  }}
                  size="lg"
                  className="cursor-pointer rounded-full text-foreground hover:bg-card/90 gap-2 shadow relative z-10"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Commencer à Apprendre
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>2 500+ Étudiants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>150+ Heures en Direct</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Stats card
          <div className="hidden md:block h-full col-span-2">
            <div
              className="bg-card/10 backdrop-blur-sm h-full relative rounded-2xl p-6 border border-primary-foreground/20"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 w-full h-full rounded-2xl top-0 left-0 bg-black/50 opacity-50 pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="text-primary-foreground font-semibold text-lg mb-4">
                  Fonctionnalités Premium en Direct
                </h3>
                <ul className="space-y-3">
                  {[
                    "Connectez-vous directement avec votre instructeur",
                    "Sessions individuelles en direct",
                    "Disponible 24h/24 et 7j/7",
                    "Sessions enregistrées pour révision ultérieure",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-primary-foreground/90"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground gap-2 relative z-10 cursor-pointer"
                  onClick={() => {
                    // Ajoutez votre logique ici
                    router.push("/dashboard/booking");
                  }}
                >
                  Réserver Maintenant
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
