import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Award, Clock } from "lucide-react";

const activityIcons = {
  course_completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  quiz_passed: {
    icon: Award,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  course_started: {
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  badge_earned: {
    icon: Award,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  other: { icon: BookOpen, color: "text-gray-500", bg: "bg-gray-500/10" },
};

export const RecentActivity = ({ activities }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card border border-gray-300 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground font-display">
          Activité récente
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 3).map((activity: any, index: number) => {
          let type: string = "other";
          let title = activity.description || "Activité";
          let subtitle = "";

          // Convert createdAt to "5 min ago"
          const time = formatDistanceToNow(new Date(activity.createdAt), {
            addSuffix: true,
            locale: fr,
          });

          switch (activity.type) {
            case "COMPLETE_COURSE":
              type = "course_completed";
              subtitle = `Cours terminé`;
              break;

            case "START_COURSE":
              type = "course_started";
              subtitle = `Cours commencé`;
              break;

            case "PASS_QUIZ":
              type = "quiz_passed";
              subtitle = `Quiz réussi`;
              break;

            case "FAIL_QUIZ":
            case "COMPLETE_QUIZ":
              type = "quiz_passed";
              subtitle = `Quiz terminé`;
              break;

            case "LOGIN":
              type = "badge_earned";
              title = "Connexion réussie";
              subtitle = "L’utilisateur a ouvert une session";
              break;

            default:
              type = "other";
              subtitle = activity.description || "Activité";
          }

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-[8px] hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{title}</p>
                <p className="text-sm text-slate-500 truncate">{subtitle}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {time}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
