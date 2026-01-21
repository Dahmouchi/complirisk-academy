"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const courses = [
  {
    title: "Mathématiques I - Semestre 1",
    instructor: "Prof. Ahmed Benali",
    image: "/optimized/math.webp",
    duration: "Semestre 1",
    students: 250,
    rating: 4.8,
    price: "Inclus",
    level: "S1",
  },
  {
    title: "Physique Générale - Semestre 3",
    instructor: "Prof. Fatima Zahra",
    image: "/optimized/physique.webp",
    duration: "Semestre 3",
    students: 185,
    rating: 4.9,
    price: "Inclus",
    level: "S3",
  },
  {
    title: "Programmation Avancée - Semestre 4",
    instructor: "Prof. Mohamed Tazi",
    image: "/optimized/programing.webp",
    duration: "Semestre 4",
    students: 198,
    rating: 4.7,
    price: "Inclus",
    level: "S4",
  },
  {
    title: "Gestion de Projet - Semestre 6",
    instructor: "Prof. Karim Alaoui",
    image: "/optimized/gestion.webp",
    duration: "Semestre 6",
    students: 142,
    rating: 4.8,
    price: "Inclus",
    level: "S6",
  },
];

const CourseCard = ({
  course,
  index,
}: {
  course: (typeof courses)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-card rounded-2xl overflow-hidden shadow-xl card-hover group w-full"
  >
    {/* Image */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {course.level}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
        {course.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{course.instructor}</p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{course.students}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-foreground">{course.rating}</span>
        </div>
        <span className="font-bold text-primary">{course.price}</span>
      </div>
    </div>
  </motion.div>
);

export const CoursesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      prevSlide();
    }
  };

  return (
    <div id="formations" className="section-padding bg-section-alt relative">
      <div className="absolute inset-0 z-0 bg-[url('/enita/bg-paper.jpg')] bg-cover bg-center opacity-50"></div>
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="heading-md text-foreground">
              Cours Populaires par Semestre
            </h2>
            <p className="text-muted-foreground mt-2">
              Découvrez les cours les plus demandés de nos universités
            </p>
          </div>
          <Button variant="hero">
            <BookOpen className="w-4 h-4 mr-2" />
            Voir le catalogue
          </Button>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="px-4"
              >
                <CourseCard course={courses[currentSlide]} index={0} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-r-2xl shadow-lg hover:bg-background transition-colors z-10"
              aria-label="Previous course"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-l-2xl shadow-lg hover:bg-background transition-colors z-10"
              aria-label="Next course"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
