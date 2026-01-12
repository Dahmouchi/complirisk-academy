import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  BarChart3,
  Clock,
} from "lucide-react";
import Progress from "../ui/progress";

const analytics = [
  {
    title: "Taux d'engagement",
    value: "78%",
    change: "+12%",
    trend: "up",
    icon: BarChart3,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    progress: 78,
  },
  {
    title: "Taux de présence",
    value: "92%",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    progress: 92,
  },
  {
    title: "Réussite aux quiz",
    value: "85%",
    change: "-3%",
    trend: "down",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    progress: 85,
  },
  {
    title: "Temps moyen",
    value: "2h 45m",
    change: "+18%",
    trend: "up",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    progress: 65,
  },
];

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {analytics.map((stat) => (
        <Card
          key={stat.title}
          className="border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.trend === "up" ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <Progress value={stat.progress} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsCards;
