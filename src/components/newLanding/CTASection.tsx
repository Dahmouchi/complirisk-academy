"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/cinq/bgblue.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background */}

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          <h2 className="heading-lg text-primary-foreground mb-6">
            Vous N'avez Pas Besoin de Voir Tout l'Escalier, Faites Juste le
            Premier Pas
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez notre plateforme et accédez à tous les cours de vos
            semestres. Améliorez vos résultats académiques avec nos ressources
            de qualité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-background text-primary hover:bg-background/90 shadow-lg"
            >
              Demander une inscription
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
            >
              Télécharger la brochure
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl" />
    </section>
  );
};
