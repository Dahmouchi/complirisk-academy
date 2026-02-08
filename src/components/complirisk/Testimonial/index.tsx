"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TestimonialType } from "@/types/testimonial";
import TestimonialSkeleton from "../Skeleton/Testimonial";
import { Icon } from "@iconify/react";

// CAROUSEL SETTINGS

const Testimonial = () => {
  const [testimonial, setTestimonial] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTestimonial(data.TestimonialData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <section id="testimonial-section" className="bg-blue-50 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row gap-5 justify-between sm:items-center mb-8">
          <div>
            <h2 className="font-bold tracking-tight text-3xl md:text-4xl">
              Ce que disent nos <br />
              <span className="text-primary">apprenants certifiés</span>
            </h2>
          </div>
          <div>
            <button className="bg-transparent cursor-pointer hover:bg-primary text-primary font-semibold hover:text-white py-3 px-6 border-2 border-primary hover:border-transparent rounded-lg duration-300 transition-all">
              Laisser un avis
            </button>
          </div>
        </div>

        <p className="text-lg font-medium mb-10 text-gray-600 max-w-3xl">
          Rejoignez les milliers de professionnels qui ont transformé leur
          expertise grâce à nos formations certifiantes ISO et conformité.
        </p>

        <Slider {...settings}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))
            : testimonial.map((items, i) => (
                <div key={i}>
                  <div className="bg-white m-4 pt-10 px-8 pb-10 h-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    {/* Photo et informations 
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="absolute -top-2 -right-2 bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                          <Icon
                            icon="mdi:check-decagram"
                            className="text-primary text-sm"
                          />
                        </div>
                        <Image
                          src={items.imgSrc}
                          alt={items.name}
                          width={80}
                          height={80}
                          className="rounded-full border-4 border-white shadow-md"
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-primary mb-1">
                          {items.profession}
                        </p>
                        <h3 className="text-xl font-bold mb-1">{items.name}</h3>
                        {items.company && (
                          <p className="text-sm text-gray-500">
                            {items.company}
                          </p>
                        )}
                      </div>
                    </div>*/}

                    {/* Étoiles */}
                    <div className="flex justify-center mb-6">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            icon="mdi:star"
                            className={`text-xl ${
                              star <= (items.rating || 5)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Témoignage */}
                    <div className="relative">
                      <Icon
                        icon="mdi:format-quote-open"
                        className="text-primary/20 text-4xl absolute -top-4 -left-2"
                      />
                      <p className="text-gray-700 leading-relaxed text-center italic">
                        {items.detail}
                      </p>
                      <Icon
                        icon="mdi:format-quote-close"
                        className="text-primary/20 text-4xl absolute -bottom-4 -right-2"
                      />
                    </div>

                    {/* Certification obtenue */}
                    {items.certification && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2">
                          <Icon
                            icon="mdi:certificate-outline"
                            className="text-primary"
                          />
                          <span className="text-sm font-medium">
                            Certification obtenue :{" "}
                            <span className="text-primary font-semibold">
                              {items.certification}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </Slider>

        {/* Statistiques de confiance */}
        <div className="mt-16 pt-12 border-t border-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-gray-600">Note moyenne</p>
              <div className="flex justify-center mt-1">
                <Icon icon="mdi:star" className="text-yellow-400" />
                <Icon icon="mdi:star" className="text-yellow-400" />
                <Icon icon="mdi:star" className="text-yellow-400" />
                <Icon icon="mdi:star" className="text-yellow-400" />
                <Icon icon="mdi:star" className="text-yellow-400" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
              <p className="text-gray-600">Avis vérifiés</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600">Taux de recommandation</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-gray-600">Réussite à la certification</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
