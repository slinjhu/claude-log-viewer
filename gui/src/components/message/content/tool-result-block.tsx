import { ClipboardCheck } from "lucide-react";
import type { ToolResultContent } from "@/lib/types";
import { JsonButton } from "./json-button";
import { ExpandableBlock } from "./expandable-block";

export function ToolResultBlock({ item }: { item: ToolResultContent }) {
  const isError = item.is_error === true;
  const preview = (item.content ?? "").replace(/\n/g, " ");

  return (
    <ExpandableBlock
      className={isError ? "border-destructive/30 bg-destructive/5" : "bg-card"}
      icon={<ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />}
      label="ToolResultBlock"
      pills={
        isError ? <span className="text-xs font-medium text-destructive">Error</span> : undefined
      }
      expandedPills={
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          tool_use_id: {item.tool_use_id}
        </span>
      }
      preview={preview}
      actions={<JsonButton data={item} title="ToolResultBlock" />}
    >
      <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
        {item.content ?? ""}
      </pre>
    </ExpandableBlock>
  );
}
