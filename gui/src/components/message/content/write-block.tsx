"use client";

import { Wrench } from "lucide-react";
import type { ToolUseContent } from "@/lib/types";
import { JsonButton } from "./json-button";
import { ExpandableBlock } from "./expandable-block";
import { CodeViewer } from "./code-viewer";

export function WriteBlock({ item }: { item: ToolUseContent }) {
  const filePath = String(item.input.file_path ?? "");
  const content = String(item.input.content ?? "");
  const preview = filePath;

  return (
    <ExpandableBlock
      className="bg-card"
      icon={<Wrench className="h-3.5 w-3.5 text-muted-foreground" />}
      label="ToolUseBlock"
      pills={
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold">
          Write
        </span>
      }
      expandedPills={
        <>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            id: {item.id}
          </span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            file_path: {filePath}
          </span>
        </>
      }
      preview={preview}
      actions={<JsonButton data={item} title="ToolUseBlock — Write" />}
    >
      <CodeViewer code={content} filePath={filePath} />
    </ExpandableBlock>
  );
}
