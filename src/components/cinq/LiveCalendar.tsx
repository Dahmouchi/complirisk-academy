"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface LiveEvent {
  id: string;
  name: string;
  startsAt: Date;
  subject: {
    name: string;
    color: string;
  };
  teacher: {
    name: string | null;
    prenom: string | null;
  };
  status: string;
}

interface LiveCalendarProps {
  events: LiveEvent[];
  onEventClick: (event: LiveEvent) => void;
}

export function LiveCalendar({ events, onEventClick }: LiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Grouper les événements par jour
  const eventsByDay = useMemo(() => {
    const grouped: { [key: string]: LiveEvent[] } = {};
    events.forEach((event) => {
      const dateKey = format(new Date(event.startsAt), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculer le jour de début (lundi = 1, dimanche = 0)
  const firstDayOfMonth = monthStart.getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier des Lives
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd&apos;hui
            </Button>
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[150px] text-center font-semibold">
              {format(currentDate, "MMMM yyyy", { locale: fr })}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Headers des jours */}
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}

          {/* Cellules vides avant le premier jour */}
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="min-h-[100px] p-2 border rounded-lg bg-muted/20"
            />
          ))}

          {/* Jours du mois */}
          {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay[dateKey] || [];
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[100px] p-2 border rounded-lg transition-colors hover:bg-muted/50",
                  isCurrentDay && "border-primary border-2 bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCurrentDay &&
                        "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left p-1.5 rounded text-xs hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: event.subject.color + "20",
                        borderLeft: `3px solid ${event.subject.color}`,
                      }}
                    >
                      <div className="font-medium truncate">
                        {format(new Date(event.startsAt), "HH:mm")}
                      </div>
                      <div className="truncate text-muted-foreground">
                        {event.subject.name}
                      </div>
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEvents.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
