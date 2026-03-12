import type { LogEntry } from "@/lib/types";
import {
  isInitEntry,
  isSummaryEntry,
  isMessageEntry,
  isThinking,
  isText,
  isToolUse,
  isToolResult,
} from "@/lib/types";
import { InitBanner } from "./init-banner";
import { SummaryBanner } from "./summary-banner";
import { ThinkingBlock } from "./thinking-block";
import { TextBlock } from "./text-block";
import { ToolUseBlock } from "./tool-use-block";
import { ToolResultBlock } from "./tool-result-block";

export function LogEntryView({ entry }: { entry: LogEntry }) {
  if (isInitEntry(entry)) {
    return <InitBanner entry={entry} />;
  }

  if (isSummaryEntry(entry)) {
    return <SummaryBanner entry={entry} />;
  }

  if (!isMessageEntry(entry)) {
    return null;
  }

  return (
    <div className="space-y-2">
      {entry.content.map((item, i) => {
        if (isThinking(item)) {
          return <ThinkingBlock key={i} text={item.thinking} />;
        }
        if (isText(item)) {
          return (
            <div key={i} className="rounded-lg border bg-card p-3">
              <TextBlock text={item.text} />
            </div>
          );
        }
        if (isToolUse(item)) {
          return <ToolUseBlock key={i} item={item} />;
        }
        if (isToolResult(item)) {
          return <ToolResultBlock key={i} item={item} />;
        }
        return null;
      })}
    </div>
  );
}
