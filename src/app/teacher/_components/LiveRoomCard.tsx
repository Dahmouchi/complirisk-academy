// components/live/LiveCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Users, Clock, Play, Calendar, Loader2 } from "lucide-react";
import { startLiveSession } from "@/actions/live-room";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface LiveRoom {
  id: string;
  name: string;
  status: string;
  recordingStatus: string;
  description: string | null;
  startsAt: Date | null;
  teacherId: string;
  image: string | null;
  subject: { name: string; color: string } | null;
}

interface LiveCardProps {
  room: any;
  isTeacher: boolean;
  userId: string; // Current logged-in user ID
}

export function LiveCard({ room, isTeacher, userId }: LiveCardProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLive = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if inside
    setIsStarting(true);
    try {
      const res = await startLiveSession(room.id);
      if (res.success) {
        toast.success("Live started! Redirecting...");
        router.push(`/teacher/dashboard/live/${room.id}`);
      } else {
        toast.error(res.error || "Failed to start");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsStarting(false);
    }
  };

  const getStatusColor = () => {
    switch (room.status) {
      case "LIVE":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "ENDED":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      default: // DRAFT, SCHEDULED
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  return (
    <Card
      className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4"
      style={{ borderLeftColor: room.subject?.color || "#ccc" }}
    >
      <CardHeader className="">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={getStatusColor()}>
            {room.status}
          </Badge>
          {room.startsAt && (
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(room.startsAt), "PPp")}
            </div>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
          {room.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{room.subject?.name}</p>
      </CardHeader>

      <CardContent className="mt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <img
                src={`${room.image}`}
                className="w-[120px] h-[60px] rounded-[8px]"
                alt=""
              />
            </div>
            <div className=" col-span-2">
              <p className="text-xs line-clamp-2">{room.description}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        {room.status === "SCHEDULED" || room.status === "DRAFT" ? (
          <>
            {isTeacher && room.teacherId === userId ? (
              <Button
                className="w-full"
                onClick={handleStartLive}
                disabled={isStarting}
              >
                {isStarting ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Video className="mr-2 h-4 w-4" />
                )}
                Démarrer le Live
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                En attente...
              </Button>
            )}
          </>
        ) : room.status === "LIVE" ? (
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => router.push(`/teacher/dashboard/live/${room.id}`)}
          >
            <Play className="mr-2 h-4 w-4" />
            Rejoindre le Live
          </Button>
        ) : room.status === "ENDED" ? (
          <div className="w-full">
            {room.recordingStatus === "COMPLETED" ? (
              <div className="w-full flex items-center">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() =>
                    router.push(`/dashboard/live/${room.id}/replay`)
                  }
                >
                  Voir le replay
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/live/${room.id}`)}
                  title="Voir détails"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                disabled
                className="flex-1 rounded-full"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                in progress
              </Button>
            )}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
