import Image from "next/image";
import { Icon } from "@iconify/react";

const values = [
  {
    icon: "mdi:star-circle",
    title: "Excellence professionnelle",
    description:
      "Contenus structurés selon les standards internationaux et mis à jour en fonction des évolutions réglementaires et sectorielles.",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: "mdi:cog-outline",
    title: "Applicabilité opérationnelle",
    description:
      "Des formations enrichies d'outils pratiques, de modèles de documents et de supports directement exploitables en entreprise.",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-blue-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: "mdi:account-heart",
    title: "Accompagnement personnalisé",
    description:
      "Encadrement assuré par des experts certifiés, avec un suivi adapté aux objectifs individuels et organisationnels.",
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-blue-50",
    iconColor: "text-violet-600",
  },
  {
    icon: "mdi:certificate",
    title: "Reconnaissance & crédibilité",
    description:
      "Des parcours menant à des attestations ou à des certifications internationales reconnues.",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-blue-50",
    iconColor: "text-amber-600",
  },
];

const stats = [
  { value: "500+", label: "Apprenants formés" },
  { value: "20+", label: "Experts certifiés" },
  { value: "95%", label: "Taux de satisfaction" },
  { value: "50+", label: "Certifications délivrées" },
];

export default function WhyChoose() {
  return (
    <section id="a-propos" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            À propos de <span className="text-primary">CompliRisk Academy</span>
          </h2>
        </div>

        {/* Two-column: Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left – Image */}
          <div className="relative group">
            {/* Decorative blob behind the image */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-blue-300/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-[4/3]">
              <Image
                src="/compli/about.jpg"
                alt="CompliRisk Academy"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Overlay gradient at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Badge on the image */}
            </div>
          </div>

          {/* Right – text content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 lg:text-left text-center">
              Excellence en Formation{" "}
              <span className="text-primary">Professionnelle</span>
            </h3>

            <div className="space-y-4 text-gray-600 leading-relaxed lg:text-left text-center">
              <p>
                Née de l&apos;expertise terrain de{" "}
                <strong>CompliRisk Consulting</strong>, CompliRisk Academy
                regroupe un réseau d&apos;experts certifiés et a pour mission
                d&apos;accompagner les professionnels et les organisations dans
                le développement de compétences stratégiques, certifiantes et
                opérationnelles.
              </p>
              <p>
                Nous concevons des parcours structurés, alignés aux standards
                internationaux et aux meilleures pratiques sectorielles, avec
                une approche résolument orientée vers l&apos;implémentation
                concrète.
              </p>
              <p>
                Notre ambition est claire : faire de l&apos;apprentissage un
                véritable <strong>levier de performance durable</strong> et de
                transformation professionnelle.
              </p>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="text-2xl font-extrabold text-primary">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nos valeurs – Cards */}
        <div>
          <div className="text-center mb-10">
            <h4 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nos <span className="text-primary">valeurs</span>
            </h4>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Les principes fondamentaux qui guident chaque formation que nous
              délivrons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="group relative flex flex-col items-center text-center bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-400 overflow-hidden cursor-default"
              >
                {/* Gradient top stripe */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 ${val.bgLight} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon icon={val.icon} className={`text-3xl text-primary`} />
                </div>

                {/* Content */}
                <h5 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {val.title}
                </h5>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {val.description}
                </p>

                {/* Bottom right gradient glow on hover */}
                <div
                  className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${val.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
