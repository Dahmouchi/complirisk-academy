import { CheckCircle2, PlayCircle, Award, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "completed" | "started" | "earned" | "downloaded";
  title: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "completed",
    title: "Completed Module 3: Risk Assessment",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "earned",
    title: "Earned ISO 37001 Foundation Badge",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    type: "started",
    title: "Started Anti-Corruption Policies course",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    type: "downloaded",
    title: "Downloaded ISO 37001 Guidelines PDF",
    timestamp: "3 days ago",
  },
];

const activityIcons = {
  completed: CheckCircle2,
  started: PlayCircle,
  earned: Award,
  downloaded: FileText,
};

const activityColors = {
  completed: "bg-success/10 text-success",
  started: "bg-info/10 text-info",
  earned: "bg-warning/10 text-warning",
  downloaded: "bg-muted text-muted-foreground",
};

export function RecentActivity() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="relative flex gap-4 pl-2">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                    activityColors[activity.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
