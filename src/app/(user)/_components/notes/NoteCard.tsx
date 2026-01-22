"use client";

import { useState } from "react";
import { Trash2, Edit3, Check, X } from "lucide-react";
import { Note, NoteColor, NOTE_COLORS, STICKER_EMOJIS } from "@/types/student";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NoteCardProps {
  note: Note;
  onUpdate: (
    id: string,
    updates: Partial<Pick<Note, "content" | "color" | "emoji">>,
  ) => void;
  onDelete: (id: string) => void;
}

const colorClasses: Record<NoteColor, string> = {
  yellow: "bg-yellow-200",
  pink: "bg-pink-200",
  blue: "bg-blue-200",
  green: "bg-green-200",
  orange: "bg-orange-200",
  purple: "bg-purple-200",
};

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onUpdate(note.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative rounded-[12px] p-4 shadow-note transition-all duration-300",
        "hover:shadow-medium hover:-translate-y-1",
        "min-h-[140px] flex flex-col",
        colorClasses[note.color],
      )}
    >
      {/* Emoji Sticker */}
      {note.emoji && (
        <span className="absolute -top-3 -right-2 text-2xl transform rotate-12 drop-shadow-sm">
          {note.emoji}
        </span>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-background/60 hover:bg-background/80 backdrop-blur-sm"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Color</p>
              <div className="flex gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate(note.id, { color })}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform hover:scale-110",
                      colorClasses[color],
                      note.color === color &&
                        "ring-2 ring-foreground ring-offset-2",
                    )}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Sticker
              </p>
              <div className="grid grid-cols-8 gap-1">
                <button
                  onClick={() => onUpdate(note.id, { emoji: undefined })}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-xs text-muted-foreground"
                >
                  ✕
                </button>
                {STICKER_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onUpdate(note.id, { emoji })}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors",
                      note.emoji === emoji && "bg-muted",
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 bg-background/60 hover:bg-background/80 backdrop-blur-sm"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className="h-7 w-7 bg-background/60 hover:bg-destructive/80 hover:text-destructive-foreground backdrop-blur-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 resize-none bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-foreground/20 text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="h-7 w-7"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap flex-1 font-handwriting">
          {note.content}
        </p>
      )}

      {/* Timestamp */}
      <p className="text-[10px] text-foreground/50 mt-2">
        {note.updatedAt.toLocaleDateString()}
      </p>
    </div>
  );
}
