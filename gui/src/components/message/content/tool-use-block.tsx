"use client";

import dynamic from "next/dynamic";
import { Wrench } from "lucide-react";
import type { ToolUseContent } from "@/lib/types";
import { useTheme } from "@/components/theme-provider";
import { JsonButton } from "./json-button";
import { ExpandableBlock } from "./expandable-block";

const ReactJson = dynamic(() => import("@smoosense/react-json-view"), {
  ssr: false,
});

export function ToolUseBlock({ item }: { item: ToolUseContent }) {
  const { resolvedTheme } = useTheme();
  const jsonTheme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  const preview = JSON.stringify(item.input).slice(0, 100);

  return (
    <ExpandableBlock
      className="bg-card"
      icon={<Wrench className="h-3.5 w-3.5 text-muted-foreground" />}
      label="ToolUseBlock"
      pills={
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold">
          {item.name}
        </span>
      }
      expandedPills={
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          id: {item.id}
        </span>
      }
      preview={preview}
      actions={<JsonButton data={item} title={`ToolUseBlock — ${item.name}`} />}
    >
      <ReactJson
        src={item.input}
        theme={jsonTheme}
        displayDataTypes={false}
        enableClipboard
        collapsed={1}
        name="input"
        style={{ fontSize: 12, background: "transparent" }}
      />
    </ExpandableBlock>
  );
}
