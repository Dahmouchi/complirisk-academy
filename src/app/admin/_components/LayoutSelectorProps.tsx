import { SectionLayout, LAYOUT_OPTIONS } from "@/lib/secion";
import { cn } from "@/lib/utils";
import { Check, LayoutGrid, Rows3, PanelLeft } from "lucide-react";

interface LayoutSelectorProps {
  value: SectionLayout;
  onChange: (value: SectionLayout) => void;
}

const layoutIcons = {
  "feature-grid": LayoutGrid,
  "carousel-cards": Rows3,
  "hero-banner": PanelLeft,
};

export const LayoutSelector = ({ value, onChange }: LayoutSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {LAYOUT_OPTIONS.map((layout) => {
        const Icon = layoutIcons[layout.value];
        return (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(layout.value)}
            className={cn(
              "relative p-4 rounded-[8px] border-2 transition-all duration-300 text-left group",
              value === layout.value
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-6 h-6 text-primary" />
              <div className="font-semibold text-sm">{layout.label}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {layout.description}
            </div>

            {value === layout.value && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
