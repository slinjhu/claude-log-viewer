import type { MessageEntry } from "@/lib/types";
import { isThinking, isText, isToolUse, isToolResult } from "@/lib/types";
import { ThinkingBlock, TextBlock, ToolUseBlock, ToolResultBlock } from "@/components/message/content";

export function AssistantMessage({ entry }: { entry: MessageEntry }) {
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
    </div>
  );
}
