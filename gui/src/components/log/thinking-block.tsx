"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThinkingBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const preview = text.slice(0, 120).replace(/\n/g, " ");

  return (
    <div className="border-l-2 border-muted-foreground/30 pl-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
        <span className="font-medium">Thinking</span>
        {!open && <span className="ml-1 truncate max-w-md opacity-60">{preview}…</span>}
      </button>
      {open && (
        <pre className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
          {text}
        </pre>
      )}
    </div>
  );
}
