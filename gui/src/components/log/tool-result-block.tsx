"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolResultContent } from "@/lib/types";

export function ToolResultBlock({ item }: { item: ToolResultContent }) {
  const [open, setOpen] = useState(false);
  const isError = item.is_error === true;
  const content = item.content;
  const preview = content.slice(0, 120).replace(/\n/g, " ");

  return (
    <div className={cn(
      "rounded-md border text-sm",
      isError ? "border-destructive/30 bg-destructive/5" : "bg-muted/30"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-90")} />
        {isError
          ? <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
          : <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
        }
        <span className="text-xs font-medium">{isError ? "Error" : "Result"}</span>
        {!open && (
          <span className="text-xs text-muted-foreground truncate font-mono">{preview}</span>
        )}
      </button>
      {open && (
        <pre className="px-3 pb-2 text-xs font-mono whitespace-pre-wrap overflow-x-auto text-muted-foreground max-h-96 overflow-y-auto">
          {content}
        </pre>
      )}
    </div>
  );
}
