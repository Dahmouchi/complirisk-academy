import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Deadline {
  id: string;
  title: string;
  course: string;
  date: string;
  type: "exam" | "assignment" | "certification";
}

const deadlines: Deadline[] = [
  {
    id: "1",
    title: "ISO 37001 Foundation Exam",
    course: "ISO 37001 Foundation",
    date: "Feb 15, 2026",
    type: "exam",
  },
  {
    id: "2",
    title: "Case Study Submission",
    course: "Anti-Bribery Compliance",
    date: "Feb 20, 2026",
    type: "assignment",
  },
  {
    id: "3",
    title: "Certification Renewal",
    course: "ISO 19600 Practitioner",
    date: "Mar 1, 2026",
    type: "certification",
  },
];

const typeColors = {
  exam: "bg-destructive/10 text-destructive border-destructive/20",
  assignment: "bg-warning/10 text-warning border-warning/20",
  certification: "bg-success/10 text-success border-success/20",
};

export function UpcomingDeadlines() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {deadline.title}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {deadline.course}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={typeColors[deadline.type]}
              >
                {deadline.type}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {deadline.date}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
