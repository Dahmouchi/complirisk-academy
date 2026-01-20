"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, BookOpen } from "lucide-react";

const courses = [
  {
    title: "Mathématiques I - Semestre 1",
    instructor: "Prof. Ahmed Benali",
    image: "/cinq/math.jpg",
    duration: "Semestre 1",
    students: 250,
    rating: 4.8,
    price: "Inclus",
    level: "S1",
  },
  {
    title: "Physique Générale - Semestre 3",
    instructor: "Prof. Fatima Zahra",
    image: "/cinq/physique.jpeg",
    duration: "Semestre 3",
    students: 185,
    rating: 4.9,
    price: "Inclus",
    level: "S3",
  },
  {
    title: "Programmation Avancée - Semestre 4",
    instructor: "Prof. Mohamed Tazi",
    image: "/cinq/programing.jpg",
    duration: "Semestre 4",
    students: 198,
    rating: 4.7,
    price: "Inclus",
    level: "S4",
  },
  {
    title: "Gestion de Projet - Semestre 6",
    instructor: "Prof. Karim Alaoui",
    image: "/cinq/gestion.jpg",
    duration: "Semestre 6",
    students: 142,
    rating: 4.8,
    price: "Inclus",
    level: "S6",
  },
];

export const CoursesSection = () => {
  return (
    <section
      id="formations"
      className="section-padding bg-section-alt relative"
    >
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

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-xl card-hover group"
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
                <p className="text-muted-foreground text-sm mb-4">
                  {course.instructor}
                </p>

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
                    <span className="font-semibold text-foreground">
                      {course.rating}
                    </span>
                  </div>
                  <span className="font-bold text-primary">{course.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
