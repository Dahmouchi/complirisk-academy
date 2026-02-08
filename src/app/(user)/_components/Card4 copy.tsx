import React from "react";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Quote,
  Star,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay

import { motion } from "framer-motion";
const ReviewCard = ({ review }: any) => {
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
          <Quote className="w-6 h-6 text-white/60 mb-4" />
          <p className="text-sm leading-relaxed font-medium mb-4">
            {review.comment}
          </p>
        </div>

        {/* Footer avec nom */}
        <div className="border-t border-white/20 pt-4">
          <h3 className="font-bold ">{review.name}</h3>
          <p className="text-white/80 lg:text-sm text-xs">Étudiant ENITA</p>
        </div>
      </div>
    </motion.div>
  );
};

const reviews = [
  {
    name: "Mohammed K. – Lauréat Master Génie Civil",
    comment:
      "Je suis embauché par le Groupe VINCI (SOGEA Maroc). L'avantage de suivre la formation à l'ENITA : c'est la souplesse que l'on peut avoir en travaillant et à la fois en suivant les cours.",
  },
  {
    name: "Fatima Z. – Licence BTP",
    comment:
      "ENITA m'a permis de concilier études et vie professionnelle grâce à la formation à distance. Les diplômes français sont un vrai plus sur le marché.",
  },

  {
    name: "Sarah L. – Bac+3 Chargé d'Affaires",
    comment:
      "Formation très professionnalisante. Les enseignements sont directement applicables en entreprise. Je recommande vivement ENITA pour les métiers du bâtiment.",
  },
];

const ReviewSection = () => {
  return (
    <div
      className="relative w-full h-[100dvh] pt-32"
      style={{
        backgroundImage: "url('/Board.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "100px" }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-5xl font-bold text-white px-2">
          Ce que <span className="text-yellow-400">nos partenaires</span> disent
          de nous
        </h2>
        <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto px-2 mt-3 md:mt-4">
          Des entreprises et institutions qui nous font confiance témoignent de
          leur expérience avec Enita.ma.
        </p>
      </motion.div>

      <div className="lg:flex justify-center gap-8 mt-6 flex-wrap hidden">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>

      <div className="lg:hidden px-2 mt-6">
        <Carousel
          opts={{ align: "center", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          className="relative group"
        >
          <CarouselContent className="gap-4 ml-2">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="px-2 basis-[87%] sm:basis-[45%]"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden sm:block z-50">
            <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-purple-500 rounded-full shadow-lg hover:bg-purple-500 hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
            <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-purple-500 rounded-full shadow-lg hover:bg-purple-500 hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
          </div>

          <div className="sm:hidden flex justify-center gap-4 mt-12 z-50 w-full">
            <CarouselPrevious className="static w-10 h-10 bg-white text-purple-500 rounded-full shadow hover:bg-purple-500 hover:text-white transition-all border border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </CarouselPrevious>
            <CarouselNext className="static w-10 h-10 bg-white text-purple-500 rounded-full shadow hover:bg-purple-500 hover:text-white transition-all border border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default ReviewSection;
