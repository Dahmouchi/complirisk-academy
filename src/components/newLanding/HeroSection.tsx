"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  { icon: CheckCircle2, text: "Apprentissage de Qualité" },
  { icon: Users, text: "+2000 Étudiants" },
  { icon: BookOpen, text: "Cours en Ligne" },
  { icon: GraduationCap, text: "Tous les Semestres" },
];

export const HeroSection = () => {
  const router = useRouter();
  return (
    <div
      id="accueil"
      className="hero-gradient pt-20 md:pt-32 pb-16 md:pb-24 relative"
    >
      <div className="absolute inset-0 z-0 bg-[url('/enita/bg-paper.jpg')] bg-cover bg-center opacity-50"></div>

      <div className="container-custom z-10 relative px-4">
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-12 lg:p-8 p-4 items-center bg-amber-50 rounded-3xl">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left lg:col-span-2"
          >
            <h1 className="heading-xl mb-6">
              Plateforme <span className="text-primary">Éducative</span> pour
              Universités Marocaines
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Accédez aux cours et ressources pédagogiques pour tous les
              semestres (S1, S2, S3, S4, S5, S6) des universités marocaines.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/test/login")}
              className="bg-primary  text-primary-foreground cursor-pointer hover:bg-background/90 shadow-lg relative z-10"
            >
              Demander une inscription
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary border-2 border-black/20 flex items-center justify-center"
                  >
                    <span className="text-xs font-semibold text-white">
                      E{i}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rejoignez nos{" "}
                  <span className="font-bold text-foreground">+2000</span>{" "}
                  étudiants
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="text-foreground text-sm ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-1"
          >
            <div className="relative">
              <img
                src={"/cinq/2334.jpg"}
                alt="Étudiants universitaires en formation"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute lg:block hidden bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card"
              >
                <p className="text-sm text-muted-foreground">
                  Apprenez des meilleurs
                </p>
                <p className="font-bold text-2xl text-foreground">
                  +20 Professeurs
                </p>
                <p className="text-xs text-primary font-medium">
                  Experts du domaine
                </p>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 -right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          </motion.div>
        </div>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:mt-16  bg-white rounded-md lg:rounded-full shadow-md p-4 md:p-8 z-10"
        >
          <div className="flex lg:flex-wrap lg:flex-row flex-col justify-between lg:items-center gap-6 md:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-foreground"
              >
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-sm md:text-base">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
