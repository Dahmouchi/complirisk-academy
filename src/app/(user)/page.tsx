import Companies from "@/components/complirisk/Companies";
import NamesList from "@/components/complirisk/Courses";
import Hero from "@/components/complirisk/Hero";
import Mentor from "@/components/complirisk/Mentor";
import Newsletter from "@/components/complirisk/Newsletter";
import Testimonial from "@/components/complirisk/Testimonial";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import WhyChoose from "@/components/complirisk/WhyChoose/Index";
import Certifications from "@/components/complirisk/Certifications";
import CoursesAccess from "@/components/complirisk/CoursesAccess";
import CertificationTestimonials from "@/components/complirisk/CertificationTestimonials";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div
        className=""
        style={{
          backgroundImage: "url('/compli/bg-login2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header visible={true} />
        <Hero />
      </div>
      <CoursesAccess />
      {/*<NamesList /><Testimonial />*/}
      <WhyChoose />
      <Certifications />
      <Mentor />
      <CertificationTestimonials />

      <Newsletter />
      {/*<HeroSection />
      <SpecialisationsSection />
      <CoursesSection />
      <AboutSection />
      <TestimonialsSection />
      <InstructorsSection />
      <CTASection />
      <Footer />*/}
      <Footer />
    </main>
  );
}
