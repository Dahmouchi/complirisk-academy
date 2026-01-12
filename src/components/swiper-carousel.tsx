"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperCarouselProps {
  children: React.ReactNode;
  slidesPerView?: number | "auto";
}

export function SwiperCarousel({
  children,
  slidesPerView = "auto",
}: SwiperCarouselProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);
  const prevButtonDesktopRef = useRef<HTMLButtonElement>(null);
  const nextButtonDesktopRef = useRef<HTMLButtonElement>(null);
  const prevButtonMobileRef = useRef<HTMLButtonElement>(null);
  const nextButtonMobileRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Navigation, Pagination],
      slidesPerView,
      spaceBetween: 20,
      pagination: {
        el: paginationRef.current,
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      },
    });

    // ✅ Manually assign navigation buttons for both mobile and desktop
    const prevButtons = [
      prevButtonDesktopRef.current,
      prevButtonMobileRef.current,
    ];
    const nextButtons = [
      nextButtonDesktopRef.current,
      nextButtonMobileRef.current,
    ];

    prevButtons.forEach((btn) => {
      btn?.addEventListener("click", () => swiper.slidePrev());
    });

    nextButtons.forEach((btn) => {
      btn?.addEventListener("click", () => swiper.slideNext());
    });

    swiperInstanceRef.current = swiper;

    return () => {
      swiper.destroy();
      prevButtons.forEach((btn) =>
        btn?.removeEventListener("click", () => swiper.slidePrev())
      );
      nextButtons.forEach((btn) =>
        btn?.removeEventListener("click", () => swiper.slideNext())
      );
    };
  }, [slidesPerView]);

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {/* Left Button - Desktop */}
        <div className="hidden sm:flex">
          <button
            ref={prevButtonDesktopRef}
            className="ml-4 w-10 h-10 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-gray-200 flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Carousel Container */}
        <div className="flex-1 w-full">
          <div ref={swiperRef} className="swiper">
            <div className="swiper-wrapper">{children}</div>
          </div>
        </div>

        {/* Right Button - Desktop */}
        <div className="hidden sm:flex">
          <button
            ref={nextButtonDesktopRef}
            className="w-10 h-10 mr-4 bg-white text-blue-600  rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-gray-200 flex items-center justify-center flex-shrink-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="sm:hidden z-50 flex justify-center gap-4 absolute -bottom-8 left-1/2 transform -translate-x-1/2 mb-4">
        <button
          ref={prevButtonMobileRef}
          className="w-10 h-10 bg-white text-blue-600 rounded-full shadow hover:bg-blue-600 hover:text-white transition-all border border-gray-200 flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          ref={nextButtonMobileRef}
          className="w-10 h-10 bg-white text-blue-600 rounded-full shadow hover:bg-blue-600 hover:text-white transition-all border border-gray-200 flex items-center justify-center"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div ref={paginationRef} className="swiper-pagination"></div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #65a30d;
        }
      `}</style>
    </div>
  );
}
