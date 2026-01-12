import { useState } from "react";

export function Header({ matieres }: any) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-center">
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
    </header>
  );
}
