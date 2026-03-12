"use client";

import dynamic from "next/dynamic";
import { Wrench } from "lucide-react";
import type { ToolUseContent } from "@/lib/types";
import { useTheme } from "@/components/theme-provider";
import { JsonButton } from "./json-button";

const ReactJson = dynamic(() => import("@smoosense/react-json-view"), {
  ssr: false,
});

export function ToolUseBlock({ item }: { item: ToolUseContent }) {
  const { resolvedTheme } = useTheme();
  const jsonTheme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  return (
    <div className="rounded-md border border-obvious-border bg-muted/50 text-sm">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">ToolUseBlock</span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          name: <span className="font-semibold text-foreground">{item.name}</span>
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          id: {item.id}
        </span>
        <JsonButton data={item} title={`ToolUseBlock — ${item.name}`} />
      </div>
      <div className="px-3 pb-2">
        <ReactJson
          src={item.input}
          theme={jsonTheme}
          displayDataTypes={false}
          enableClipboard
          collapsed={1}
          name="input"
          style={{ fontSize: 12, background: "transparent" }}
        />
      </div>
    </div>
  );
}
