"use client";

import Companies from "@/components/complirisk/Companies";
import NamesList from "@/components/complirisk/Courses";
import Hero from "@/components/complirisk/Hero";
import Mentor from "@/components/complirisk/Mentor";
import Newsletter from "@/components/complirisk/Newsletter";
import Testimonial from "@/components/complirisk/Testimonial";

const Index = () => {
  return (
    <div>
      <Hero />
      <Companies />
      <NamesList />
      <Mentor />
      <Testimonial />
      <Newsletter />
    </div>
  );
};

export default Index;
