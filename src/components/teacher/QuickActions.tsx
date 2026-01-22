import { Button } from "@/components/ui/button";
import {
  BookPlus,
  FileText,
  Video,
  Users,
  ArrowRight,
  Lock,
} from "lucide-react";

const actions = [
  {
    icon: Video,
    label: "Gérer les lives",
    description: "Liste et gérer les sessions en direct",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    href: "/teacher/dashboard/live",
    locked: false,
  },
  {
    icon: BookPlus,
    label: "Gérer les actualités",
    description: "Nouvelle actualité",
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    href: "/teacher/dashboard/actualites",
    locked: false,
  },
  {
    icon: FileText,
    label: "Ajouter un devoir",
    description: "Exercices et évaluations",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    href: "#",
    locked: true,
  },
  {
    icon: Video,
    label: "Planifier une classe",
    description: "Session en direct",
    color:
      "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    href: "#",
    locked: true,
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Component = action.locked ? "div" : "a";

        return (
          <Component
            href={!action.locked ? action.href : undefined}
            key={action.label}
            className={`h-auto p-4 flex flex-col shadow items-start gap-3 bg-card border border-border/50 rounded-[8px] transition-all relative ${
              action.locked
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:bg-primary/20 hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            {action.locked && (
              <div className="absolute top-2 right-2 bg-muted/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  Bientôt
                </span>
              </div>
            )}
            <div className={`p-2.5 rounded-[8px] ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
            {!action.locked && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Component>
        );
      })}
    </div>
  );
};

export default QuickActions;
