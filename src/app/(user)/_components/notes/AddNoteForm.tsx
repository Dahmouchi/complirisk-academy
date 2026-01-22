import { useState } from "react";
import { Plus } from "lucide-react";
import { NoteColor, NOTE_COLORS, STICKER_EMOJIS } from "@/types/student";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddNoteFormProps {
  onAdd: (content: string, color: NoteColor, emoji?: string) => void;
}

const colorClasses: Record<NoteColor, string> = {
  yellow: "bg-yellow-200",
  pink: "bg-pink-200",
  blue: "bg-blue-200",
  green: "bg-green-200",
  orange: "bg-orange-200",
  purple: "bg-purple-200",
};

export function AddNoteForm({ onAdd }: AddNoteFormProps) {
  const [content, setContent] = useState("");
  const [color, setColor] = useState<NoteColor>("yellow");
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onAdd(content.trim(), color, emoji);
      setContent("");
      setEmoji(undefined);
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "w-full rounded-[8px] p-4 shadow-soft transition-all duration-300",
          "hover:shadow-medium hover:-translate-y-0.5",
          "flex items-center justify-center gap-2",
          "border-2 border-dashed border-border hover:border-primary/50",
          "text-muted-foreground hover:text-foreground",
        )}
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Ajouter une note</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[12px] p-4 shadow-note transition-all duration-300",
        colorClasses[color],
      )}
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ecrivez votre note ici..."
        className="resize-none rounded-[8px] bg-white/50 border-none focus-visible:ring-1 focus-visible:ring-foreground/20 mb-3 min-h-[100px] font-handwriting text-lg"
        autoFocus
      />

      {/* Color Selection */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-foreground/70">Couleur:</span>
        <div className="flex gap-1.5">
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded-full transition-all duration-200",
                colorClasses[c],
                color === c
                  ? "ring-2 ring-foreground ring-offset-1 scale-110"
                  : "hover:scale-105",
              )}
            />
          ))}
        </div>
      </div>

      {/* Emoji Selection */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-foreground/70">Sticker:</span>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setEmoji(undefined)}
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded transition-colors text-xs",
              emoji === undefined ? "bg-white/70" : "hover:bg-white/50",
              "text-muted-foreground",
            )}
          >
            ✕
          </button>
          {STICKER_EMOJIS.slice(0, 8).map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded transition-colors",
                emoji === e ? "bg-white/70" : "hover:bg-white/50",
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setContent("");
            setIsExpanded(false);
          }}
          className="text-foreground/70 hover:text-foreground"
        >
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="bg-blue-500 rounded-[8px] text-white hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter une note
        </Button>
      </div>
    </div>
  );
}
