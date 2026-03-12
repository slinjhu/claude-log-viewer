"use client";

import dynamic from "next/dynamic";
import type { MessageEntry } from "@/lib/types";
import { isThinking, isText, isToolUse, isToolResult } from "@/lib/types";
import { useTheme } from "@/components/theme-provider";
import { ThinkingBlock, TextBlock, ToolUseBlock, ToolResultBlock } from "@/components/message/content";

const ReactJson = dynamic(() => import("@smoosense/react-json-view"), {
  ssr: false,
});

export function UserMessage({ entry }: { entry: MessageEntry }) {
  const { resolvedTheme } = useTheme();
  const jsonTheme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  return (
    <div className="space-y-3">
      {/* content */}
      <div className="rounded-lg border p-3">
        <div className="text-xs font-medium text-muted-foreground mb-2">content ({entry.content.length})</div>
        <div className="space-y-2">
          {entry.content.map((item, i) => {
            if (isThinking(item)) return <ThinkingBlock key={i} item={item} />;
            if (isText(item)) return <TextBlock key={i} item={item} />;
            if (isToolUse(item)) return <ToolUseBlock key={i} item={item} />;
            if (isToolResult(item)) return <ToolResultBlock key={i} item={item} />;
            return null;
          })}
        </div>
      </div>

      {/* tool_use_result */}
      {entry.tool_use_result && Object.keys(entry.tool_use_result).length > 0 && (
        <div className="rounded-lg border p-3">
          <ReactJson
            src={entry.tool_use_result}
            theme={jsonTheme}
            displayDataTypes={false}
            enableClipboard
            collapsed={1}
            name="tool_use_result"
            style={{ fontSize: 12, background: "transparent" }}
          />
        </div>
      )}
    </div>
  );
}
