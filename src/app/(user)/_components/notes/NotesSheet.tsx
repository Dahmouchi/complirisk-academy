"use client";
import { useState } from "react";
import { StickyNote, X, LayoutGrid, List } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/useNotes";
import { AddNoteForm } from "./AddNoteForm";
import { NotesBoard } from "./NotesBoard";
import { NoteCard } from "./NoteCard";

interface NotesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function NotesSheet({ open, onOpenChange, userId }: NotesSheetProps) {
  const { notes, addNote, updateNote, deleteNote } = useNotes(userId);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [showAll, setShowAll] = useState(false);

  const displayedNotes = showAll ? notes : notes.slice(0, 4);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg p-0 border-l border-border/50 bg-white"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[8px] bg-blue-500/10 text-blue-500">
                <StickyNote className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold">Mes notes</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted p-1  rounded-[8px]">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("board")}
                  className={cn(
                    "h-8 w-8 rounded-[8px]",
                    viewMode === "board" && "bg-white shadow-soft",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 rounded-[8px]",
                    viewMode === "list" && "bg-white shadow-soft ",
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-6 space-y-6">
            {/* Add Note Form */}
            <AddNoteForm onAdd={addNote} />

            {/* Notes Display */}
            {viewMode === "board" ? (
              <NotesBoard
                notes={displayedNotes}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ) : (
              <div className="space-y-3">
                {displayedNotes.map((note: any, index: number) => (
                  <div
                    key={note.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-in-right"
                  >
                    <NoteCard
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4 animate-bounce-soft">📝</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucune note pour le moment
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Commencez à ajouter des notes pour suivre votre parcours
                      d&apos;apprentissage!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Show All Button */}
            {notes.length > 4 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Afficher moins" : `Afficher tout (${notes.length})`}
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
