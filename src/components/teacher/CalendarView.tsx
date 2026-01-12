import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, FileText, Users } from "lucide-react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const today = new Date();

const upcomingEvents = [
  {
    id: 1,
    title: "Cours de Mécanique des Sols",
    type: "class",
    time: "09:00 - 11:00",
    date: today,
    students: 28,
    icon: Video,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: 2,
    title: "Remise TP Béton Armé",
    type: "deadline",
    time: "23:59",
    date: today,
    students: 45,
    icon: FileText,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    id: 3,
    title: "Session Q&A - Hydraulique",
    type: "class",
    time: "14:00 - 15:30",
    date: addDays(today, 1),
    students: 32,
    icon: Users,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: 4,
    title: "Examen Résistance des Matériaux",
    type: "exam",
    time: "10:00 - 12:00",
    date: addDays(today, 2),
    students: 50,
    icon: FileText,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  {
    id: 5,
    title: "Atelier CAO/DAO",
    type: "class",
    time: "15:00 - 17:00",
    date: addDays(today, 3),
    students: 20,
    icon: Video,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
];

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'class':
      return 'Cours';
    case 'deadline':
      return 'Échéance';
    case 'exam':
      return 'Examen';
    default:
      return type;
  }
};

const CalendarView = () => {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Calendrier à venir
        </CardTitle>
        <Badge variant="outline" className="font-normal">
          {upcomingEvents.length} événements
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className={`p-2.5 rounded-lg ${event.color}`}>
              <event.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {event.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.students} étudiants
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {format(event.date, 'dd MMM', { locale: fr })}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {getTypeLabel(event.type)}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
