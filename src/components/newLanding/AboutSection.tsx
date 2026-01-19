"use client";
import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, Video, Globe, Award } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Cours en Ligne",
    description: "Plateforme d'apprentissage moderne et interactive",
  },
  {
    icon: Video,
    title: "Bibliothèques Modernes",
    description: "Ressources numériques et espaces d'étude équipés",
  },
  {
    icon: Globe,
    title: "Partenariats Universitaires",
    description: "Échanges internationaux et programmes de mobilité",
  },
  {
    icon: Award,
    title: "Diplômes Reconnus",
    description: "Certifications accréditées par l'État marocain",
  },
];

export const AboutSection = () => {
  return (
    <div id="about" className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src={"/cinq/about.jpg"}
                alt="Étudiants universitaires en formation"
                className="w-full h-auto object-cover bg-center aspect-[4/3]"
              />
              {/* Floating Stats Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 z-50 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-primary"
              >
                <div className="text-center">
                  <p className="text-4xl font-bold">98%</p>
                  <p className="text-sm opacity-90">Taux de réussite</p>
                </div>
              </motion.div>
            </div>

            {/* Decorative */}
            <div className="absolute -z-10 -top-8 -left-8 w-32 h-32 bg-accent rounded-full" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Pourquoi Notre Plateforme ?
            </span>
            <h2 className="heading-lg text-foreground mt-3 mb-6">
              Nous Offrons la Meilleure{" "}
              <span className="text-blue-600">Éducation Universitaire</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Notre plateforme accompagne les étudiants des universités
              marocaines dans leur parcours académique. Accédez à des cours de
              qualité pour tous les semestres (S1 à S6) et réussissez vos études
              avec excellence.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-[8px] bg-accent flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
