"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LogEntry, ContentItem, MessageEntry } from "@/lib/types";
import { pyClass, contentClass, isMessageEntry, isThinking, isText, isToolUse, isToolResult } from "@/lib/types";
import { LogRow } from "./log-row";
import { LogEntryContent } from "./log-entry";
import { ThinkingBlock, TextBlock, ToolUseBlock, ToolResultBlock } from "@/components/message/content";

export interface Turn {
  index: number;
  entries: LogEntry[];
}

export function groupIntoTurns(entries: LogEntry[]): (LogEntry | Turn)[] {
  const result: (LogEntry | Turn)[] = [];
  let currentTurn: LogEntry[] = [];
  let turnIndex = 0;

  for (const entry of entries) {
    const cls = pyClass(entry);

    if (cls === "AssistantMessage") {
      currentTurn.push(entry);
    } else if (cls === "UserMessage" && currentTurn.length > 0) {
      currentTurn.push(entry);
      turnIndex++;
      result.push({ index: turnIndex, entries: currentTurn });
      currentTurn = [];
    } else {
      if (currentTurn.length > 0) {
        turnIndex++;
        result.push({ index: turnIndex, entries: currentTurn });
        currentTurn = [];
      }
      result.push(entry);
    }
  }

  if (currentTurn.length > 0) {
    turnIndex++;
    result.push({ index: turnIndex, entries: currentTurn });
  }

  return result;
}

export function isTurn(item: LogEntry | Turn): item is Turn {
  return "index" in item && "entries" in item;
}

export type ViewMode = "contents" | "messages";

interface TurnAccordionProps {
  turn: Turn;
  viewMode: ViewMode;
  firstEpoch: number | null;
  onShowJson: (entry: LogEntry) => void;
}

export function TurnAccordion({ turn, viewMode, firstEpoch, onShowJson }: TurnAccordionProps) {
  const [open, setOpen] = useState(true);

  const allContents = useMemo(() => {
    const items: ContentItem[] = [];
    for (const entry of turn.entries) {
      if (isMessageEntry(entry)) {
        items.push(...(entry as MessageEntry).content);
      }
    }
    return items;
  }, [turn.entries]);

  const contentSummary = useMemo(() => {
    return allContents.map((item) => {
      const cls = contentClass(item);
      if (!cls) return "?";
      const short = cls.replace("Block", "").replace("Content", "");
      if (isToolUse(item)) return `${short}(${item.name})`;
      return short;
    }).join(" → ");
  }, [allContents]);

  return (
    <div className="border border-obvious-border rounded-lg overflow-hidden">
      {/* Turn header */}
      <div className="flex items-center gap-2 text-xs select-none">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center shrink-0 px-2 py-2 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        </button>
        <span className="font-medium text-foreground">
          Turn {turn.index}
        </span>
        <span className="text-muted-foreground truncate">
          {contentSummary}
        </span>
      </div>

      {/* Turn body */}
      {open && viewMode === "messages" && (
        <div className="border-t px-3 py-2 space-y-1">
          {turn.entries.map((entry, i) => (
            <LogRow
              key={i}
              entry={entry}
              firstEpoch={firstEpoch}
              isFirst={false}
              onShowJson={() => onShowJson(entry)}
            >
              <LogEntryContent entry={entry} />
            </LogRow>
          ))}
        </div>
      )}

      {open && viewMode === "contents" && (
        <div className="border-t px-3 py-2 space-y-1">
          {allContents.map((item, i) => {
            if (isThinking(item)) return <ThinkingBlock key={i} item={item} />;
            if (isText(item)) return <TextBlock key={i} item={item} />;
            if (isToolUse(item)) return <ToolUseBlock key={i} item={item} />;
            if (isToolResult(item)) return <ToolResultBlock key={i} item={item} />;
            return null;
          })}
        </div>
      )}
    </div>
  );
}
