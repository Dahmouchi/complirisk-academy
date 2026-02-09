import { CheckCircle2, PlayCircle, Award, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "completed" | "started" | "earned" | "downloaded";
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

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

export function RecentActivity({ activities }: RecentActivityProps) {
  console.log("RecentActivity received activities:", activities);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={index} className="relative flex gap-4 pl-2">
                  <div
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                    )}
                  ></div>
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
        )}
      </CardContent>
    </Card>
  );
}
