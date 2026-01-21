"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const specialisations = [
  {
    title: "Faculté des Sciences",
    image: "/optimized/science.webp",
    description: "Mathématiques, Physique, Chimie, Informatique",
  },
  {
    title: "Faculté des Lettres",
    image: "/optimized/lettres.webp",
    description: "Langues, Littérature, Sciences Humaines",
  },
  {
    title: "Faculté de Droit",
    image: "/optimized/doit.webp",
    description: "Droit privé, Droit public, Sciences politiques",
  },
  {
    title: "Faculté d'Économie",
    image: "/optimized/economie.webp",
    description: "Économie, Gestion, Commerce",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const SpecialisationsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="heading-md text-foreground">
              Choisissez votre faculté
            </h2>
            <p className="text-muted-foreground mt-2">
              Nos facultés et filières universitaires
            </p>
          </div>
          <a
            href="#formations"
            className="hidden md:flex items-center gap-1 text-primary font-medium hover:underline"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {specialisations.map((spec, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative rounded-2xl overflow-hidden cursor-pointer card-hover"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={spec.image}
                  alt={spec.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-primary-foreground font-semibold text-lg md:text-xl mb-1">
                    {spec.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm hidden md:block">
                    {spec.description}
                  </p>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All */}
        <div className="md:hidden mt-6 text-center">
          <a
            href="#formations"
            className="inline-flex items-center gap-1 text-primary font-medium"
          >
            Voir toutes les facultés
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
