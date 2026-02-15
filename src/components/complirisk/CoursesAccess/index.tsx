import Link from "next/link";
import { Icon } from "@iconify/react";

export default function CoursesAccess() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-6">
          {/* Titre */}
          <h2 className="text-3xl md:text-4xl font-bold">
            Découvrez Nos <span className="text-primary">Parcours</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            CompliRisk Academy propose un ensemble structuré de formations
            professionnelles et certifiantes. Connectez-vous pour accéder à
            l&apos;intégralité des programmes et contenus disponibles.
          </p>

          {/* Bouton CTA */}
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center space-x-3 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Icon icon="mdi:login" className="text-2xl" />
              <span>Se connecter pour accéder aux formations</span>
            </Link>
          </div>

          {/* Indicateurs visuels optionnels */}
          <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:check-circle" className="text-primary text-xl" />
              <span>Formations certifiantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:check-circle" className="text-primary text-xl" />
              <span>Parcours structurés</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:check-circle" className="text-primary text-xl" />
              <span>Experts certifiés</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
