import { Button } from "@/components/ui/button";
import { BookPlus, FileText, Video, Users } from "lucide-react";

const actions = [
  {
    icon: BookPlus,
    label: "Créer un cours",
    description: "Nouveau module de formation",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: FileText,
    label: "Ajouter un devoir",
    description: "Exercices et évaluations",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    icon: Video,
    label: "Planifier une classe",
    description: "Session en direct",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    icon: Users,
    label: "Gérer les étudiants",
    description: "Liste et groupes",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="h-auto p-4 flex flex-col items-start gap-3 bg-card hover:bg-accent/50 border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className={`p-2.5 rounded-xl ${action.color}`}>
            <action.icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
