import { useParticipants } from "@livekit/components-react";
import { Users, Crown, Mic, MicOff } from "lucide-react";
import { Track } from "livekit-client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ParticipantsListProps {
  teacherIdentity?: string;
}

export const ParticipantsList = ({ teacherIdentity }: ParticipantsListProps) => {
  const participants = useParticipants();

  // Sort: teacher first, then alphabetically
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.identity === teacherIdentity) return -1;
    if (b.identity === teacherIdentity) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Participants</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {participants.length}
          </span>
        </div>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="p-2">
          {sortedParticipants.map((participant) => {
            const isTeacher = participant.identity === teacherIdentity;
            const micTrack = participant.getTrackPublication(Track.Source.Microphone);
            const isMuted = !micTrack || micTrack.isMuted;

            return (
              <div
                key={participant.identity}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isTeacher ? 'bg-teacher/10' : 'bg-student/10'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isTeacher ? 'text-teacher' : 'text-student'
                    }`}>
                      {participant.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {participant.name || 'Anonymous'}
                      </span>
                      {isTeacher && (
                        <Crown className="w-3 h-3 text-teacher" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isTeacher ? 'Teacher' : 'Student'}
                    </span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isMuted ? 'bg-muted' : 'bg-online/10'
                }`}>
                  {isMuted ? (
                    <MicOff className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Mic className="w-3 h-3 text-online" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
