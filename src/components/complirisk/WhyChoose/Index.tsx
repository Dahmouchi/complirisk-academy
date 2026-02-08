import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function WhyChoose() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className="lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            À propos de <span className="text-primary">CompliRisk</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Colonne gauche - Image et statistiques */}
          <div
            className="relative rounded-2xl h-[400px] overflow-hidden lg:shadow-2xl lg:h-full w-full"
            style={{
              backgroundImage: "url('/compli/login7.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Colonne droite - Contenu */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">
                Excellence en Formation Professionnelle depuis 2010
              </h3>
              <p className="text-gray-600">
                Fondée par des experts en certification ISO et conformité
                réglementaire, CompliRisk Academy a pour mission de démocratiser
                l&apos;accès aux formations certifiantes de haut niveau. Nous
                croyons que chaque organisation mérite d&apos;être accompagnée
                dans sa démarche qualité.
              </p>
            </div>

            {/* Nos valeurs */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Nos Valeurs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:certificate"
                      className="text-2xl text-primary"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Excellence Technique</h5>
                    <p className="text-sm text-gray-600">
                      Contenu mis à jour en permanence avec les dernières
                      évolutions normatives
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:handshake"
                      className="text-2xl text-primary"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">
                      Accompagnement Personnalisé
                    </h5>
                    <p className="text-sm text-gray-600">
                      Suivi individuel et mentorat par nos experts certifiés
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:lightbulb-on"
                      className="text-2xl text-primary"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Pragmatisme</h5>
                    <p className="text-sm text-gray-600">
                      Outils pratiques directement applicables en entreprise
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:earth" className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">
                      Reconnaissance Internationale
                    </h5>
                    <p className="text-sm text-gray-600">
                      Certifications reconnues par les organismes
                      d&apos;accréditation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
