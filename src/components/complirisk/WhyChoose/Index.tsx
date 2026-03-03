import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function WhyChoose() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
            À propos de <span className="text-primary">CompliRisk Academy</span>
          </h2>
        </div>

        <div className="space-y-12">
          {/* Excellence en Formation Professionnelle */}
          <div className="space-y-6 text-center">
            <h3 className="text-2xl md:text-3xl font-bold">
              Excellence en Formation Professionnelle
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Née de l&apos;expertise terrain de CompliRisk Consulting,
                CompliRisk Academy regroupe un réseau d&apos;experts certifiés
                et a pour mission d&apos;accompagner les professionnels et les
                organisations dans le développement de compétences stratégiques,
                certifiantes et opérationnelles.
              </p>
              <p>
                Nous concevons des parcours structurés, alignés aux standards
                internationaux et aux meilleures pratiques sectorielles, avec
                une approche résolument orientée vers l&apos;implémentation
                concrète.
              </p>
              <p>
                Notre ambition est claire : faire de l&apos;apprentissage un
                véritable levier de performance durable et de transformation
                professionnelle.
              </p>
            </div>
          </div>

          {/* Nos valeurs */}
          <div className="space-y-8">
            <h4 className="text-2xl md:text-3xl font-bold">Nos valeurs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:star-circle"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-lg mb-2">
                    Excellence professionnelle
                  </h5>
                  <p className="text-sm text-gray-600">
                    Contenus structurés selon les standards internationaux et
                    mis à jour en fonction des évolutions réglementaires et
                    sectorielles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:cog-outline"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-lg mb-2">
                    Applicabilité opérationnelle
                  </h5>
                  <p className="text-sm text-gray-600">
                    Des formations enrichies d&apos;outils pratiques, de modèles
                    de documents et de supports directement exploitables en
                    entreprise.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:account-heart"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-lg mb-2">
                    Accompagnement personnalisé
                  </h5>
                  <p className="text-sm text-gray-600">
                    Encadrement assuré par des experts certifiés, avec un suivi
                    adapté aux objectifs individuels et organisationnels.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:certificate"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="font-semibold text-lg mb-2">
                    Reconnaissance & crédibilité
                  </h5>
                  <p className="text-sm text-gray-600">
                    Des parcours menant à des attestations ou à des
                    certifications internationales reconnues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
