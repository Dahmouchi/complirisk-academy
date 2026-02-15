import { Icon } from "@iconify/react";

export default function CertificationTestimonials() {
  const testimonials = [
    {
      text: "« La formation sur la mise en place d'un dispositif KYS a été déterminante pour structurer notre démarche d'évaluation des tiers. Les outils de scoring, les matrices de cotation et les études de cas concrètes m'ont permis de sécuriser nos relations fournisseurs et partenaires. J'ai désormais une méthodologie claire pour identifier les tiers à risque et formaliser un processus de due diligence robuste et traçable. »",
      certification: "KYS – Third Party Risk Management Practitioner",
      gradient: "from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
      iconColor: "text-primary",
    },
    {
      text: "« La formation LBC/FT a profondément renforcé ma compréhension des mécanismes de prévention du blanchiment et du financement du terrorisme. Les cas pratiques, les simulations de détection d'opérations atypiques et les échanges avec l'expert-formateur m'ont permis de structurer une approche réellement basée sur les risques. J'ai pu immédiatement améliorer nos procédures internes et affiner notre dispositif de surveillance des opérations. »",
      certification: "LBC/FT – Risk Based Approach & Compliance Officer",
      gradient: "from-blue-100 to-blue-50",
      borderColor: "border-blue-300",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Témoignages de <span className="text-primary">Certifiés</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les retours d&apos;expérience de professionnels ayant
            suivi nos formations certifiantes
          </p>
        </div>

        {/* Grille de témoignages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br  rounded-2xl p-8 border ${testimonial.borderColor} hover:shadow-xl transition-all duration-300`}
            >
              {/* Icône de citation */}
              <div className="mb-6">
                <Icon
                  icon="mdi:format-quote-open"
                  className={`text-5xl ${testimonial.iconColor} opacity-50`}
                />
              </div>

              {/* Texte du témoignage */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                {testimonial.text}
              </p>
              {/* Certification obtenue */}
              <div className="flex items-start space-x-3 pt-6 border-t border-gray-300">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Certification obtenue :
                  </p>
                  <p className={`font-bold ${testimonial.iconColor}`}>
                    {testimonial.certification}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
