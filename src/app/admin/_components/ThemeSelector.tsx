import { ThemeStyle, THEME_OPTIONS, THEME_STYLES } from "@/lib/secion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  value: ThemeStyle;
  onChange: (value: ThemeStyle) => void;
}

export const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {THEME_OPTIONS.map((theme) => {
        const themeConfig = THEME_STYLES[theme.value];
        const isSelected = value === theme.value;

        return (
          <button
            key={theme.value}
            type="button"
            onClick={() => onChange(theme.value)}
            className={cn(
              "relative p-4 rounded-[8px] border-2 transition-all duration-300 text-left group overflow-hidden",
              isSelected
                ? "border-primary shadow-lg shadow-primary/20 scale-105"
                : "border-border hover:border-primary/50 hover:shadow-md"
            )}
          >
            {/* Theme Preview */}
            <div
              className={cn(
                "w-full h-20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden",
                themeConfig.colors.background
              )}
            >
              {/* Preview Cards */}
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-5 h-7 rounded transition-transform group-hover:scale-110",
                      themeConfig.colors.cardBackground,
                      themeConfig.colors.border,
                      "border",
                      // Add staggered animation delay
                      i === 1 && "delay-0",
                      i === 2 && "delay-75",
                      i === 3 && "delay-150"
                    )}
                  >
                    {/* Mini accent line */}
                    <div
                      className={cn(
                        "h-1 w-full rounded-t",
                        theme.value === "modern-dark" && "bg-indigo-400",
                        theme.value === "light-minimal" && "bg-gray-900",
                        theme.value === "gradient-bold" && "bg-yellow-300",
                        theme.value === "corporate" && "bg-blue-600"
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Background gradient overlay for gradient-bold */}
              {theme.value === "gradient-bold" && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 -z-10" />
              )}
            </div>

            {/* Theme Info */}
            <div className="space-y-1">
              <div className="font-semibold text-sm flex items-center gap-2">
                {theme.label}
                {isSelected && (
                  <span className="text-xs text-primary">✓ Active</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {theme.description}
              </div>

              {/* Color Palette Preview */}
              <div className="flex gap-1 mt-2 pt-2 border-t border-border/50">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full",
                    theme.value === "modern-dark" && "bg-indigo-400",
                    theme.value === "light-minimal" && "bg-gray-900",
                    theme.value === "gradient-bold" && "bg-yellow-300",
                    theme.value === "corporate" && "bg-blue-600"
                  )}
                  title="Accent Color"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full",
                    theme.value === "modern-dark" && "bg-slate-800",
                    theme.value === "light-minimal" &&
                      "bg-white border border-gray-300",
                    theme.value === "gradient-bold" && "bg-pink-600",
                    theme.value === "corporate" &&
                      "bg-gray-100 border border-gray-300"
                  )}
                  title="Background Color"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full",
                    theme.value === "modern-dark" && "bg-slate-700",
                    theme.value === "light-minimal" && "bg-gray-200",
                    theme.value === "gradient-bold" && "bg-orange-500",
                    theme.value === "corporate" && "bg-blue-100"
                  )}
                  title="Secondary Color"
                />
              </div>

              {/* Theme Features */}
              <div className="flex flex-wrap gap-1 mt-2">
                {themeConfig.features.glassmorphism && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    Glass
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {themeConfig.features.animations}
                </span>
              </div>
            </div>

            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                <Check size={14} className="text-primary-foreground" />
              </div>
            )}

            {/* Hover Glow Effect */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10",
                theme.value === "modern-dark" && "bg-indigo-500/5",
                theme.value === "light-minimal" && "bg-gray-900/5",
                theme.value === "gradient-bold" &&
                  "bg-gradient-to-br from-purple-500/10 to-orange-500/10",
                theme.value === "corporate" && "bg-blue-500/5"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
