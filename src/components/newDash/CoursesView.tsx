import CourseCard from "./CourseCard";
import StatsCard from "./StatsCard";
import SearchBar from "./SearchBar";
import { Clock, Play, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CoursesView = ({ matieres, registeredUser, onTabChange }: any) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // Flatten all courses from all matieres with their matiere info
  const allCourses =
    matieres?.flatMap(
      (matiere: any) =>
        matiere.courses?.map((course: any) => ({
          ...course,
          matiereName: matiere.name,
          matiereId: matiere.id,
        })) || [],
    ) || [];

  // Filter courses based on active category and search query
  const filteredCourses = allCourses.filter((course: any) => {
    // First filter by category (matiere)
    const matchesCategory =
      activeCategory === "All" || course.matiereId === activeCategory;

    // Then filter by search query (search in title and description)
    const matchesSearch =
      searchQuery === "" ||
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 lg:p-6 p-3 overflow-auto lg:pb-0 pb-24">
      <div className="max-w-5xl">
        {!registeredUser && (
          <div className="relative w-full mt-12 lg:mt-0 text-primary-foreground bg-blue-600 p-8 rounded-2xl space-y-6">
            {/* Background image - removed z-index */}
            <div
              style={{
                backgroundImage: "url('/optimized/items2.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-50 pointer-events-none"
            ></div>

            {/* Content with proper z-index */}
            <div className="relative z-10 space-y-3">
              <Badge
                variant="default"
                className="text-sm px-4 py-1.5 rounded-full bg-red-600"
              >
                <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
                Sessions EN DIRECT Disponibles
              </Badge>

              <h1 className="text-3xl md:text-4xl text-white lg:text-5xl font-bold leading-tight">
                Apprenez avec des Professeurs Experts en Temps Réel
              </h1>

              {/* Removed z-50 from this div as it's not needed */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  onClick={() => router.push("/dashboard/live")}
                  size="lg"
                  className="cursor-pointer rounded-full text-foreground hover:bg-card/90 gap-2 hover:text-blue-700 shadow relative z-10"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Commencer à Apprendre
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>2 500+ Étudiants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>150+ Heures en Direct</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <h1 className="lg:text-3xl text-2xl font-bold my-8 flex items-center gap-2">
          Votre Coures Gratuit 🎓
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
              {matieres.map((category: any) => (
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
          <div>
            <StatsCard
              total={allCourses.length}
              completed={0}
              upcoming={allCourses.length}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Aucun cours ne correspond à "${searchQuery}"`
                : "Aucun cours disponible dans cette catégorie"}
            </p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-primary hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                onClick={() =>
                  router.push(`/dashboard/matiere/${course.matiereId}`)
                }
                thumbnail={course.coverImage}
                description={course.description}
                instructor={course.matiereName}
                status="completed"
                variant="card"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
