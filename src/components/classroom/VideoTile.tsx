import { Track, Participant } from "livekit-client";
import { useTracks, VideoTrack, AudioTrack } from "@livekit/components-react";
import { Mic, MicOff, Monitor, Crown } from "lucide-react";

interface VideoTileProps {
  participant: Participant;
  isTeacher?: boolean;
  isMain?: boolean;
}

export const VideoTile = ({ participant, isTeacher = false, isMain = false }: VideoTileProps) => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.Microphone, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]).filter(t => t.participant?.identity === participant.identity);

  const cameraTrack = tracks.find(t => t.source === Track.Source.Camera && t.publication?.track);
  const screenTrack = tracks.find(t => t.source === Track.Source.ScreenShare && t.publication?.track);
  const micTrack = tracks.find(t => t.source === Track.Source.Microphone && t.publication?.track);

  const hasCamera = !!cameraTrack?.publication && !cameraTrack.publication.isMuted;
  const hasScreen = !!screenTrack?.publication && !screenTrack.publication.isMuted;
  const hasMic = !!micTrack?.publication && !micTrack.publication.isMuted;

  const displayTrack = hasScreen ? screenTrack : cameraTrack;
  const hasVideo = hasScreen || hasCamera;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted aspect-video`}>
      {hasVideo && displayTrack?.publication?.track ? (
        <video
          ref={(el) => {
            if (el && displayTrack.publication?.track) {
              displayTrack.publication.track.attach(el);
            }
          }}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <div className={`${isMain ? 'w-24 h-24' : 'w-16 h-16'} rounded-full bg-primary/10 flex items-center justify-center`}>
            <span className={`${isMain ? 'text-4xl' : 'text-2xl'} font-bold text-primary`}>
              {participant.name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
        </div>
      )}

      {/* Audio element for playback */}
      {micTrack?.publication?.track && (
        <audio
          ref={(el) => {
            if (el && micTrack.publication?.track) {
              micTrack.publication.track.attach(el);
            }
          }}
          autoPlay
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTeacher && (
              <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                <Crown className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <span className="text-sm font-medium text-white truncate max-w-[150px]">
              {participant.name || 'Anonymous'}
            </span>
            {hasScreen && (
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Monitor className="w-3 h-3" />
                Screen
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {hasMic ? (
              <Mic className="w-4 h-4 text-green-400" />
            ) : (
              <MicOff className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
