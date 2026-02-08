import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  User,
  GraduationCap,
  BookOpen,
  Award,
} from "lucide-react";

// Design 1: Carte moderne avec effet glassmorphism
const ModernGlassCard = ({ review }: any) => {
  return (
    <motion.div
      className="relative w-80 h-96 rounded-[6px] overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background avec gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20" />

      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Contenu */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Header avec icône */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>

        {/* Citation */}
        <div className="flex-1 flex flex-col justify-center">
          <Quote className="w-8 h-8 text-white/60 mb-4" />
          <p className="text-lg leading-relaxed font-medium mb-4">
            {review.comment}
          </p>
        </div>

        {/* Footer avec nom */}
        <div className="border-t border-white/20 pt-4">
          <h3 className="font-bold text-xl">{review.name}</h3>
          <p className="text-white/80 text-sm">Étudiant Scoolia</p>
        </div>
      </div>
    </motion.div>
  );
};

// Design 2: Carte minimaliste avec bordure colorée
const MinimalistCard = ({ review }: any) => {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="relative w-80 h-96 bg-white rounded-[6px] shadow-xl overflow-hidden group"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bordure colorée animée */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${randomColor}`}
      />

      {/* Contenu */}
      <div className="p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${randomColor} flex items-center justify-center`}
          >
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{review.name}</h3>
            <p className="text-gray-600">Étudiant Scoolia</p>
          </div>
        </div>

        {/* Citation */}
        <div className="flex-1">
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-300" />
            <p className="text-gray-700 text-lg leading-relaxed pl-6">
              {review.comment}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">5.0</span>
        </div>
      </div>
    </motion.div>
  );
};

// Design 3: Carte avec effet de profondeur 3D
const Card3D = ({ review }: any) => {
  return (
    <motion.div
      className="relative w-80 h-96 perspective-1000"
      whileHover={{ rotateY: 5, rotateX: 5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-[6px] shadow-2xl transform-gpu preserve-3d">
        {/* Effet de lumière */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[6px]" />

        {/* Contenu */}
        <div className="relative p-8 h-full flex flex-col text-white">
          {/* Header avec badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{review.name}</h3>
                <p className="text-gray-400 text-sm">Scoolia Student</p>
              </div>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Vérifié
            </div>
          </div>

          {/* Citation avec style moderne */}
          <div className="flex-1 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Quote className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed pl-4">
              {review.comment}
            </p>
          </div>

          {/* Footer avec rating et badge */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">
                Top Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Design 4: Carte avec animation de particules
const ParticleCard = ({ review }: any) => {
  return (
    <motion.div
      className="relative w-80 h-96 rounded-[6px] overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background avec pattern animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />

      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Contenu */}
      <div className="relative p-8 h-full flex flex-col text-white z-10">
        {/* Header stylisé */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-xl">{review.name}</h3>
          <p className="text-white/80">Étudiant Scoolia</p>
        </div>

        {/* Citation centrale */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Quote className="w-12 h-12 mx-auto mb-4 text-white/60" />
            <p className="text-lg leading-relaxed font-medium">
              {review.comment}
            </p>
          </div>
        </div>

        {/* Rating avec style unique */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <p className="text-white/80 text-sm">Expérience exceptionnelle</p>
        </div>
      </div>
    </motion.div>
  );
};

// Design 5: Carte avec effet néon
const NeonCard = ({ review }: any) => {
  return (
    <motion.div
      className="relative w-80 h-96 rounded-[6px] overflow-hidden group"
      whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Background sombre */}
      <div className="absolute inset-0 bg-gray-900" />

      {/* Bordure néon */}
      <div className="absolute inset-0 rounded-[6px] border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300" />

      {/* Contenu */}
      <div className="relative p-8 h-full flex flex-col text-white">
        {/* Header avec effet néon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              {review.name}
            </h3>
            <p className="text-gray-400">Digital Student</p>
          </div>
        </div>

        {/* Citation avec effet glow */}
        <div className="flex-1 relative">
          <div className="absolute -top-2 -left-2 w-8 h-8 text-blue-400">
            <Quote className="w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </div>
          <p className="text-gray-300 text-lg leading-relaxed pl-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            {review.comment}
          </p>
        </div>

        {/* Footer avec éléments néon */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
              />
            ))}
          </div>
          <div className="px-3 py-1 border border-green-400 rounded-full text-green-400 text-xs font-semibold shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            VERIFIED
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal avec tous les designs
const NewReviewCardDesigns = () => {
  const reviews = [
    {
      name: "Sara M. – Lycée",
      comment:
        "Grâce à Scoolia, j'ai enfin compris mes cours de mathématiques. Les vidéos sont claires et les exercices m'ont beaucoup aidée à progresser.",
    },
    {
      name: "Yassine B. – Collège",
      comment:
        "J'adore les QCM interactifs ! C'est motivant et ça me permet de savoir rapidement où je dois m'améliorer.",
    },
    {
      name: "Inès T. – Terminale",
      comment:
        "Une plateforme très bien faite. Je révise à mon rythme, et je me sens beaucoup plus confiante pour les examens.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Nouveaux Designs de Cartes de Témoignages
        </h1>

        {/* Design 1: Modern Glass */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            1. Design Glassmorphism Moderne
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {reviews.map((review, index) => (
              <ModernGlassCard key={index} review={review} />
            ))}
          </div>
        </section>

        {/* Design 2: Minimalist */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            2. Design Minimaliste
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {reviews.map((review, index) => (
              <MinimalistCard key={index} review={review} />
            ))}
          </div>
        </section>

        {/* Design 3: 3D Effect */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            3. Design 3D avec Profondeur
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {reviews.map((review, index) => (
              <Card3D key={index} review={review} />
            ))}
          </div>
        </section>

        {/* Design 4: Particle Effect */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            4. Design avec Particules Animées
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {reviews.map((review, index) => (
              <ParticleCard key={index} review={review} />
            ))}
          </div>
        </section>

        {/* Design 5: Neon Effect */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            5. Design Néon Futuriste
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {reviews.map((review, index) => (
              <NeonCard key={index} review={review} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewReviewCardDesigns;
export { ModernGlassCard, MinimalistCard, Card3D, ParticleCard, NeonCard };
