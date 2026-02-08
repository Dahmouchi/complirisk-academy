"use client";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FullPageScroll, {
  FullPageScrollSystem,
} from "@/components/FullPageScroll";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Award,
  BotMessageSquare,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  GraduationCap,
  Wallet2,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Card from "@/app/(user)/_components/testCard";
import CardSection from "@/app/(user)/_components/Card2 copy";
import CardSectionMatiere from "@/app/(user)/_components/Card3";
import CardsContainer from "@/app/(user)/_components/Card3 copy";
import ReviewSection from "@/app/(user)/_components/Card4 copy";
import { SectionWithFeatures } from "@/lib/secion";
import HeroCompo from "./HeroCompo";
import GridComponent from "./GridComponent";
import GradSection from "@/app/admin/_components/GridSection";

const ModernFeatureCards = ({ features }: any) => {
  return (
    <div className="relative p-2">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br rounded-3xl" />

      {/* Grille de cartes */}
      <div className="relative z-10 lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-8 lg:p-6 p-2 hidden">
        {features.map((feature: any, index: any) => (
          <Card
            key={index}
            feature={feature}
            index={index}
            theme={feature.theme}
          />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden px-2 mt-6">
        {" "}
        {/* Added px-6 for side padding */}
        <Carousel
          opts={{
            align: "center", // Changed from "center" to "start"
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
          className="relative group"
        >
          <CarouselContent className="gap-4 ml-2">
            {" "}
            {/* Added ml-4 */}
            {features.map((features: any, index: any) => (
              <CarouselItem
                key={index}
                className="px-2 basis-[85%] sm:basis-[45%] "
              >
                <Card
                  key={features.id}
                  feature={features}
                  theme={features.theme}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <div className="hidden sm:block z-50">
            <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-yellow-400 rounded-full shadow-lg hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
            <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-yellow-400 rounded-full shadow-lg hover:bg-[#8ebd21] hover:text-white transition-all border border-gray-200 opacity-0 group-hover:opacity-100 z-10" />
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex justify-center gap-4 mt-12 z-50 w-full">
            <CarouselPrevious className="static w-10 h-10 bg-white text-[#8ebd21] rounded-full shadow hover:bg-yellow-400 hover:text-white transition-all border border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </CarouselPrevious>
            <CarouselNext className="static w-10 h-10 bg-white text-[#8ebd21] rounded-full shadow hover:bg-yellow-400 hover:text-white transition-all border border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    </div>
  );
};
// Configuration des sections d'exemple
const ExampleSection1 = () => {
  return (
    <div className="max-h-screen  w-full">
      <div className="  lg:px-14 px-4 ">
        <div
          className="rounded-[6px] relative flex flex-col lg:flex-row lg:items-center lg:justify-center  lg:h-[90vh] h-[86.5vh] w-full" // 112px = py-14 (3.5rem) * 2
          style={{
            backgroundImage: `url("/Board.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:gap-4 lg:w-1/2 lg:justify-center justify-end  lg:p-14 p-4"
          >
            <h1 className="text-midnight_text text-2xl sm:text-5xl font-semibold mt-30 text-white">
              École N°1 dans le BTP,{" "}
              <span className="text-blue-500">
                Génie Civil - Immobilier au Maroc
              </span>
            </h1>
            <h3 className="text-white/70 lg:text-lg text-sm pt-2 lg:pt-0">
              Formations diplômantes de Bac+2 à Bac+5 en Génie Civil, BTP et
              Travaux Publics. 100% à distance, VAE ou présentiel avec des
              diplômes français reconnus.
            </h3>
            {/*<div className="relative rounded-full pt-5 lg:pt-0">
                                    <input type="Email address" name="q" className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-white rounded-full focus:outline-none shadow-input-shadow" placeholder="search courses..." autoComplete="off" />
                                    <button className="bg-secondary p-5 rounded-full absolute right-2 top-2 ">
                                        <Icon
                                            icon="solar:magnifer-linear"
                                            className="text-white text-4xl inline-block"
                                        />
                                    </button>
                                </div>*/}
            <div className="flex flex-col gap-3 pt-6 lg:pt-4">
              <div className="flex gap-2">
                <Image
                  src="/images/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-white">
                  Diplômes français reconnus de Bac+2 à Bac+5
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/images/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-white">
                  Formation 100% à distance ou en présentiel
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/images/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-white">
                  Validation des acquis de l&apos;expérience (VAE)
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div className=" justify-center place-items-end h-full  items-end hidden lg:flex">
            <Image
              src="/enita/student5.png"
              alt="nothing"
              className="lg:w-4/5 w-2/3 h-auto"
              width={800}
              height={805}
            />
          </motion.div>
          <motion.div className=" absolute bottom-0 lg:hidden w-full flex items-center justify-center">
            <Image
              src="/enita/student5.png"
              alt="nothing"
              className="lg:w-4/5 w-2/3 h-auto"
              width={800}
              height={805}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ExampleSection2 = () => {
  const features = [
    {
      icon: <Award className="text-4xl mb-4 w-12 h-10" />,
      title: "Diplômes Français Reconnus",
      description:
        "Formations diplômantes de Bac+2 à Bac+5 avec des diplômes français et anglophones.",
    },
    {
      icon: <Briefcase className="text-4xl mb-4 w-12 h-10" />,
      title: "Formation Professionnelle",
      description:
        "La souplesse de travailler et suivre sa formation en même temps. Validation des Acquis de l'Expérience.",
    },
    {
      icon: <Globe className="text-4xl mb-4 w-12 h-10" />,
      title: "3 Modes de Formation",
      description:
        "100% à distance, en présentiel à Casablanca, ou par VAE. Apprenez selon vos besoins  professionnelles.",
    },
    {
      icon: <GraduationCap className="text-4xl mb-4 w-12 h-10" />,
      title: "Partenariats Internationaux",
      description:
        "École française délocalisée au Maroc avec partenariats ESCT Paris, IMP Paris, IMSI Paris et Abertay University.",
    },
  ];

  return (
    <div
      className="relative w-full h-[100dvh]"
      id="courses"
      style={{
        backgroundImage: "url('/Board.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-4 h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "100px" }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-white px-2 mt-32">
            Pourquoi choisir <span className="text-indigo-400">ENITA</span> ?
          </h2>
          <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto px-2 mt-3 md:mt-4">
            École française spécialisée en Génie Civil et BTP, avec des
            formations diplômantes reconnues et flexibles.
          </p>
        </motion.div>

        <div className="h-[calc(100%-200px)]">
          <ModernFeatureCards features={features} />
        </div>
      </div>
    </div>
  );
};
const exampleSections = [
  {
    id: "hero",
    component: <ExampleSection1 />,
    backgroundColor: "",
  },
  {
    id: "section2",
    component: <ExampleSection2 />,
    backgroundColor: "",
  },
  {
    id: "section3",
    component: <CardSection />,
    backgroundColor: "",
  },
  {
    id: "section4",
    component: <CardsContainer />,
    backgroundColor: "",
  },
  {
    id: "section5",
    component: <ReviewSection />,
    backgroundColor: "",
  },
];
const sectionComponents: Record<string, React.FC<any>> = {
  "hero-banner": HeroCompo,
  "carousel-cards": GridComponent,
  "feature-grid": GradSection,
  // Add more layouts here...
};
// Composant d'exemple complet
const FullPageScrollExample = ({ sections }: { sections: any[] }) => {
  const exampleSections = sections.map((section) => {
    const Component = sectionComponents[section.layoutType] || HeroCompo; // fallback
    const theme = section.designStyleKey;
    return {
      id: section.id,
      component: <Component data={section} theme={theme} />,
      backgroundColor: section.backgroundColor || "",
    };
  });

  return (
    <div>
      <Header visible={false} />
      <FullPageScrollSystem sections={exampleSections} />
    </div>
  );
};

export default FullPageScrollExample;
