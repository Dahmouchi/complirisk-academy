"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotesSheet } from "./NotesSheet";

export function FloatingNotesButton({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-0 lg:top-1/2 top-5/6 -translate-y-1/2 z-50",
          "flex items-center gap-2 px-3 py-4",
          "bg-primary  text-white",
          "rounded-l-2xl shadow-medium",
          "transition-all duration-300 ease-out",
          "hover:pr-5 hover:shadow-lg",
          "group"
        )}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        <StickyNote className="h-5 w-5 rotate-90 group-hover:animate-bounce-soft" />
        <span className="font-semibold text-sm tracking-wide">Notes</span>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-l-2xl bg-primary animate-pulse-glow -z-10" />
      </button>

      {/* Notes Sheet */}
      <NotesSheet open={isOpen} onOpenChange={setIsOpen} userId={userId} />
    </>
  );
}
