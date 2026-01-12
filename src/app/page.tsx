import MatterportViewer from "@/components/MatterportViewer";
import { AboutSection } from "@/components/newLanding/AboutSection";
import { CoursesSection } from "@/components/newLanding/CoursesSection";
import { CTASection } from "@/components/newLanding/CTASection";
import { Footer } from "@/components/newLanding/Footer";
import { HeroSection } from "@/components/newLanding/HeroSection";
import { InstructorsSection } from "@/components/newLanding/InstructorsSection";
import { Navbar } from "@/components/newLanding/Navbar";
import { SpecialisationsSection } from "@/components/newLanding/SpecialisationsSection";
import { TestimonialsSection } from "@/components/newLanding/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <HeroSection />
      <SpecialisationsSection />
      <CoursesSection />
      <AboutSection />
      <TestimonialsSection />
      <InstructorsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
