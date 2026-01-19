import { cn } from "@/lib/utils";
import GradSection from "./GridSection";
import GridComponent from "@/components/GridComponent";
import HeroCompo from "@/components/HeroCompo";

export const SectionPreview = ({ section }: any) => {
  const theme = section.designStyleKey;
  const layout = section.layoutType || "feature-grid";
  const checklistString = section.checklistItems as string;

  return (
    <div
      className={cn(
        "relative w-full min-h-[500px] h-full rounded-[8px] overflow-y-hidden shadow-lg",
        theme === "modern-dark" && "theme-modern-dark",
        theme === "light-minimal" && "theme-light-minimal",
        theme === "gradient-bold" && "theme-gradient-bold",
        theme === "corporate" && "theme-corporate"
      )}
    >
      {/* Overlay for background images */}

      {layout === "feature-grid" && (
        <GradSection data={section} theme={theme} />
      )}
      {layout === "carousel-cards" && (
        <GridComponent data={section} theme={theme} />
      )}
      {layout === "hero-banner" && <HeroCompo data={section} theme={theme} />}
    </div>
  );
};
