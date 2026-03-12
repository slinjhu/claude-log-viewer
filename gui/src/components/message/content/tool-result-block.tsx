import { ClipboardCheck } from "lucide-react";
import type { ToolResultContent } from "@/lib/types";
import { JsonButton } from "./json-button";

export function ToolResultBlock({ item }: { item: ToolResultContent }) {
  const isError = item.is_error === true;
  return (
    <div className={`rounded-md border text-sm ${isError ? "border-destructive/30 bg-destructive/5" : "border-obvious-border bg-muted/30"}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">ToolResultBlock</span>
        {isError && <span className="text-xs font-medium text-destructive">Error</span>}
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          tool_use_id: {item.tool_use_id}
        </span>
        <JsonButton data={item} title="ToolResultBlock" />
      </div>
      <pre className="px-3 pb-2 text-xs font-mono whitespace-pre-wrap overflow-x-auto text-muted-foreground">
        {item.content ?? ""}
      </pre>
    </div>
  );
}
