"use client";
import { ChevronRight } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { SwiperCarousel } from "@/components/swiper-carousel";
import { SwiperSlide } from "@/components/swiper-slide";
import { useState } from "react";

interface CoursesSectionProps {
  title: string;
  description?: string;
  courses: any;
  variant?: "free" | "live";
}

export function CoursesSection({
  title,
  description,
  courses,
  variant = "free",
}: CoursesSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter courses based on active category
  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course: any) => course.id === activeCategory);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* div header
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {variant === "live" && (
                <span className="w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {title}
              </h2>
            </div>
            {description && (
              <p className="text-muted-foreground max-w-2xl">{description}</p>
            )}
          </div>
          <Button variant="ghost" className="text-primary gap-1 hidden sm:flex">
            Voir tous les cours
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div> */}
        <header className="sticky top-0 z-50 w-full border-b border-border">
          <div className="container mx-auto  flex items-center justify-start">
            {/* Categories */}
            <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              <button
                key={"All"}
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === "All"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {"Tout"}
              </button>
              {courses.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </header>
        {/* Courses grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCourses.map((course: any, index: number) => {
            if (course.courses.length === 0) return null;
            return (
              <div key={index}>
                <div className="lg:grid hidden lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6 mt-4 ">
                  {course?.courses?.slice(0, 3).map((c: any, index: number) => (
                    <div key={index}>
                      <CourseCard cour={c} />
                    </div>
                  ))}
                </div>

                <div className=" relative lg:hidden  lg:px-28 px-4">
                  <SwiperCarousel>
                    {course?.courses?.map((c: any, index: number) => (
                      <SwiperSlide key={c.id}>
                        <div className="py-8 px-2">
                          <CourseCard cour={c} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </SwiperCarousel>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view all button */}
        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" className="gap-1">
            voir tous les cours
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
