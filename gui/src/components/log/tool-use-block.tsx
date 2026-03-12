"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolUseContent } from "@/lib/types";

export function ToolUseBlock({ item }: { item: ToolUseContent }) {
  const [open, setOpen] = useState(false);
  const inputStr = JSON.stringify(item.input, null, 2);
  const isShort = inputStr.length < 200;

  return (
    <div className="rounded-md border bg-muted/50 text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted/80 transition-colors cursor-pointer"
      >
        <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-90")} />
        <span className="font-mono font-semibold text-xs">{item.name}</span>
        {!open && isShort && (
          <span className="text-xs text-muted-foreground truncate font-mono">
            {formatInputPreview(item)}
          </span>
        )}
      </button>
      {open && (
        <pre className="px-3 pb-2 text-xs font-mono whitespace-pre-wrap overflow-x-auto text-muted-foreground">
          {inputStr}
        </pre>
      )}
    </div>
  );
}

function formatInputPreview(item: ToolUseContent): string {
  const { name, input } = item;
  if (name === "Read" && input.file_path) return String(input.file_path);
  if (name === "Glob" && input.pattern) return String(input.pattern);
  if (name === "Grep" && input.pattern) return String(input.pattern);
  if (name === "Bash" && input.command) return String(input.command).slice(0, 80);
  if (name === "Edit" && input.file_path) return String(input.file_path);
  if (name === "Write" && input.file_path) return String(input.file_path);
  return JSON.stringify(input).slice(0, 80);
}
