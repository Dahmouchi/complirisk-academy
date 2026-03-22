"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Icon } from "@iconify/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Formateur = {
  id: string;
  fullName: string;
  bio?: string | null;
  specialite: string;
  image?: string | null;
  user?: any;
};

type MentorProps = {
  formateurs: Formateur[];
};

const Mentor = ({ formateurs }: MentorProps) => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: formateurs.length > 3,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      },
      pagination: {
        el: paginationRef.current,
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });

    return () => {
      swiper.destroy();
    };
  }, [formateurs]);

  if (formateurs.length === 0) return null;

  return (
    <section id="mentors-section" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
              Nos <span className="text-primary">Experts</span>
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              CompliRisk Academy fédère un réseau d&apos;experts certifiés
              intervenant selon les thématiques et les programmes. Les profils
              présentés ci-dessous représentent une partie des expertises
              mobilisées au sein de l&apos;Academy.
            </p>
          </div>
        </div>

        {/* Swiper Container */}
        <div className="relative">
          <div ref={swiperRef} className="swiper !pb-14">
            <div className="swiper-wrapper">
              {formateurs.map((formateur) => (
                <div key={formateur.id} className="swiper-slide h-auto pb-4">
                  <div className="group relative shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full mx-1">
                    {/* Image */}
                    <div className="h-72 w-full overflow-hidden bg-gray-100">
                      {formateur.user?.image ? (
                        <Image
                          src={formateur.user.image || ""}
                          alt={formateur.fullName}
                          width={600}
                          height={600}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                          <span className="text-5xl font-bold text-primary/50">
                            {formateur.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3 w-full">
                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 text-center">
                        {formateur.user?.name} {formateur.user?.prenom}
                      </h3>

                      {/* Specialite */}
                      <p className="text-sm text-primary font-semibold text-center">
                        {formateur.specialite}
                      </p>

                      {/* Bio */}
                      {formateur.bio && (
                        <p className="text-gray-500 text-sm text-center line-clamp-3">
                          {formateur.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots */}
            <div ref={paginationRef} className="swiper-pagination mt-8" />
          </div>

          {/* Navigation Buttons */}
          {formateurs.length > 3 && (
            <>
              <button
                ref={prevRef}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white shadow-xl rounded-full p-3 text-primary hover:bg-primary hover:text-white transition-all border border-gray-100 hidden md:block"
              >
                <Icon icon="mdi:chevron-left" className="text-2xl" />
              </button>
              <button
                ref={nextRef}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white shadow-xl rounded-full p-3 text-primary hover:bg-primary hover:text-white transition-all border border-gray-100 hidden md:block"
              >
                <Icon icon="mdi:chevron-right" className="text-2xl" />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #261cc1;
        }
        .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default Mentor;
