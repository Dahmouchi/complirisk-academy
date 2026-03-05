"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    text: "« La formation sur la mise en place d'un dispositif KYS a été déterminante pour structurer notre démarche d'évaluation des tiers. Les outils de scoring, les matrices de cotation et les études de cas concrètes m'ont permis de sécuriser nos relations fournisseurs et partenaires. J'ai désormais une méthodologie claire pour identifier les tiers à risque et formaliser un processus de due diligence robuste et traçable. »",
    certification: "KYS – Third Party Risk Management Practitioner",
    borderColor: "border-blue-300",
    iconColor: "text-blue-600",
    bgFrom: "#eff6ff",
    bgTo: "#dbeafe",
  },
  {
    text: "« La formation LBC/FT a profondément renforcé ma compréhension des mécanismes de prévention du blanchiment et du financement du terrorisme. Les cas pratiques, les simulations de détection d'opérations atypiques et les échanges avec l'expert-formateur m'ont permis de structurer une approche réellement basée sur les risques. J'ai pu immédiatement améliorer nos procédures internes et affiner notre dispositif de surveillance des opérations. »",
    certification: "LBC/FT – Risk Based Approach & Compliance Officer",
    borderColor: "border-blue-300",
    iconColor: "text-blue-600",
    bgFrom: "#eff6ff",
    bgTo: "#dbeafe",
  },
  {
    text: "« La formation ISO 37001 Lead Implementer m'a permis de structurer de manière méthodique notre dispositif anti-corruption. Au-delà de la compréhension de la norme, les ateliers pratiques sur la cartographie des risques, la due diligence des tiers et la formalisation des contrôles m'ont donné une vision claire des exigences opérationnelles. J'ai désormais la capacité de piloter un projet de mise en conformité, d'accompagner les métiers et de préparer efficacement l'organisation à l'audit de certification. »",
    certification: "ISO 37001 – Lead Implementer PECB",
    borderColor: "border-blue-300",
    iconColor: "text-blue-600",
    bgFrom: "#eff6ff",
    bgTo: "#dbeafe",
  },
  {
    text: "« La formation ISO 9001 Lead Auditor m'a permis de développer une vision structurée et rigoureuse de l'audit des systèmes de management de la qualité. Au-delà de la norme, j'ai acquis une véritable méthodologie d'audit : planification, techniques d'entretien, analyse des processus et formulation de constats pertinents. Les exercices pratiques m'ont aidé à renforcer mon esprit critique et à identifier les écarts tout en apportant une réelle valeur ajoutée aux équipes auditées. Je suis désormais capable de conduire des audits internes et externes avec assurance, objectivité et professionnalisme. »",
    certification: "ISO 9001 – Lead Auditor PECB",
    borderColor: "border-blue-300",
    iconColor: "text-blue-600",
    bgFrom: "#eff6ff",
    bgTo: "#dbeafe",
  },
];

export default function CertificationTestimonials() {
  const swiperRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination],
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: paginationRef.current,
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <section className="pt-20 bg-gray-50">
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

        {/* Swiper carousel */}
        <div className="relative pb-10">
          <div ref={swiperRef} className="swiper">
            <div className="swiper-wrapper">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="swiper-slide h-auto">
                  <div
                    className={`h-full rounded-2xl p-8 border ${testimonial.borderColor} hover:shadow-xl transition-all duration-300`}
                    style={{
                      background: `linear-gradient(135deg, ${testimonial.bgFrom}, ${testimonial.bgTo})`,
                    }}
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
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div ref={paginationRef} className="swiper-pagination mt-6" />
        </div>
      </div>

      <style jsx global>{`
        .swiper-slide {
          height: auto;
        }
        .swiper-pagination {
          position: relative;
          margin-top: 1.5rem;
        }
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #261cc1;
        }
      `}</style>
    </section>
  );
}
