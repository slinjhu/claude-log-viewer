"use client";

import { useState } from "react";
import { ChevronRight, Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LogEntry, ContentItem } from "@/lib/types";
import {
  pyClass,
  isInitEntry,
  isSummaryEntry,
  isMessageEntry,
  isThinking,
  isText,
  isToolUse,
  isToolResult,
} from "@/lib/types";

// --- Time formatting ---

function formatAbsoluteTime(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString();
}

function formatRelativeTime(epoch: number, firstEpoch: number): string {
  const diff = epoch - firstEpoch;
  if (diff < 60) return `+${diff.toFixed(1)}s`;
  if (diff < 3600) return `+${Math.floor(diff / 60)}m ${(diff % 60).toFixed(0)}s`;
  return `+${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

// --- Class colors ---

const CLASS_COLORS: Record<string, string> = {
  SystemMessage: "text-blue-500",
  AssistantMessage: "text-green-500",
  UserMessage: "text-orange-500",
  ResultMessage: "text-purple-500",
};

// --- Preview extraction ---

function getPreview(entry: LogEntry): string {
  if (isInitEntry(entry)) {
    const d = entry.data;
    return `${d.model} · ${d.cwd}`;
  }

  if (isSummaryEntry(entry)) {
    const dur = (entry.duration_ms / 1000).toFixed(1);
    const cost = entry.total_cost_usd != null ? ` · $${entry.total_cost_usd.toFixed(4)}` : "";
    return `${entry.num_turns} turns · ${dur}s${cost}`;
  }

  if (isMessageEntry(entry)) {
    for (const item of entry.content) {
      if (isText(item)) return item.text.slice(0, 120).replace(/\n/g, " ");
      if (isToolUse(item)) return `${item.name}(${formatToolInput(item)})`;
      if (isToolResult(item)) {
        const prefix = item.is_error ? "Error: " : "";
        return prefix + (item.content ?? "").slice(0, 100).replace(/\n/g, " ");
      }
      if (isThinking(item)) return item.thinking.slice(0, 100).replace(/\n/g, " ");
    }
  }

  return "";
}

function formatToolInput(item: ContentItem & { name: string; input: Record<string, unknown> }): string {
  const { name, input } = item;
  if (name === "Read" && input.file_path) return String(input.file_path);
  if (name === "Glob" && input.pattern) return String(input.pattern);
  if (name === "Grep" && input.pattern) return String(input.pattern);
  if (name === "Bash" && input.command) return String(input.command).slice(0, 80);
  if (name === "Edit" && input.file_path) return String(input.file_path);
  if (name === "Write" && input.file_path) return String(input.file_path);
  return JSON.stringify(input).slice(0, 60);
}

function getSubtype(entry: LogEntry): string | undefined {
  if ("subtype" in entry) return entry.subtype as string;
  return undefined;
}

// --- Component ---

interface LogRowProps {
  entry: LogEntry;
  firstEpoch: number | null;
  isFirst: boolean;
  onShowJson: () => void;
  children: React.ReactNode;
}

export function LogRow({ entry, firstEpoch, isFirst, onShowJson, children }: LogRowProps) {
  const [open, setOpen] = useState(false);

  const epoch = entry._epoch;
  const cls = pyClass(entry);
  const subtype = getSubtype(entry);
  const preview = getPreview(entry);

  const timeStr = epoch
    ? isFirst
      ? formatAbsoluteTime(epoch)
      : firstEpoch
        ? formatRelativeTime(epoch, firstEpoch)
        : formatAbsoluteTime(epoch)
    : null;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Accordion header */}
      <div
        className="flex items-center gap-0 text-xs select-none"
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center shrink-0 px-2 py-2 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        </button>

{/* Time */}
        <span className="w-28 shrink-0 font-mono text-muted-foreground truncate">
          {timeStr ?? ""}
        </span>

        {/* Class */}
        <span className={cn("w-32 shrink-0 font-medium truncate", CLASS_COLORS[cls ?? ""] ?? "text-muted-foreground")}>
          {cls ?? ""}
        </span>

        {/* Subtype */}
        <span className="w-16 shrink-0">
          {subtype && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground">
              {subtype}
            </span>
          )}
        </span>

        {/* Preview */}
        <span className="flex-1 min-w-0 truncate text-muted-foreground font-mono pr-2">
          {preview}
        </span>

        {/* JSON button */}
        <button
          onClick={(e) => { e.stopPropagation(); onShowJson(); }}
          className="shrink-0 px-2 py-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
          title="View raw JSON"
        >
          <Braces className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Accordion content */}
      {open && (
        <div className="border-t px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
