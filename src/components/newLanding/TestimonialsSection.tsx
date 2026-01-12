"use client";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Youssef El Mansouri",
    role: "Étudiant en Sciences, S5",
    content:
      "Cette plateforme m'a aidé à réussir mes examens. Les cours sont bien structurés et faciles à comprendre. Je recommande vivement à tous les étudiants universitaires.",
    rating: 5,
  },
  {
    name: "Sara Benkirane",
    role: "Étudiante en Économie, S4",
    content:
      "Grâce aux ressources disponibles, j'ai pu améliorer mes notes et mieux comprendre les matières difficiles. Une plateforme indispensable pour les étudiants.",
    rating: 5,
  },
  {
    name: "Mehdi Chraibi",
    role: "Étudiant en Droit, S6",
    content:
      "Les cours en ligne sont très complets et m'ont permis de réviser efficacement. C'est un excellent complément aux cours magistraux de l'université.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="section-padding bg-section-alt relative">
      <div className="absolute inset-0 bg-[url('/enita/bg-paper.jpg')] bg-cover bg-center opacity-50"></div>
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="heading-md text-foreground mt-3">
            Ce Que Disent <span className="text-blue-600">Nos Étudiants</span>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  activeIndex === index
                    ? "border-primary scale-110"
                    : "border-border opacity-50"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {testimonials[index].name.charAt(0)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-lg p-8 md:p-12 shadow-lg text-center relative"
          >
            <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />

            <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
              {testimonials[activeIndex].content}
            </p>

            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>

            <h4 className="font-bold text-foreground text-lg">
              {testimonials[activeIndex].name}
            </h4>
            <p className="text-muted-foreground">
              {testimonials[activeIndex].role}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
