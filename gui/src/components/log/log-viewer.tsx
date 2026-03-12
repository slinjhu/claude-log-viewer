"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchLog } from "@/lib/api";
import type { LogEntry } from "@/lib/types";
import { LogRow } from "./log-row";
import { LogEntryContent } from "./log-entry";
import { JsonDialog } from "./json-dialog";
import { groupIntoTurns, isTurn, TurnAccordion } from "./turn";
import type { ViewMode } from "./turn";

export function LogViewer() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonDialog, setJsonDialog] = useState<{ data: LogEntry } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("contents");

  useEffect(() => {
    if (!filePath) {
      setEntries([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchLog(filePath)
      .then((data) => setEntries(data.entries))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filePath]);

  const firstEpoch = useMemo(() => {
    for (const entry of entries) {
      if (entry._epoch) return entry._epoch;
    }
    return null;
  }, [entries]);

  const items = useMemo(() => groupIntoTurns(entries), [entries]);

  if (!filePath) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">
          No log file specified. Pass a file path as a URL parameter.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">No entries found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Control bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b text-xs">
        <span className="text-muted-foreground">View</span>
        <div className="flex items-center rounded-md border overflow-hidden">
          <button
            onClick={() => setViewMode("contents")}
            className={cn(
              "px-2.5 py-1 cursor-pointer transition-colors",
              viewMode === "contents"
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Contents
          </button>
          <button
            onClick={() => setViewMode("messages")}
            className={cn(
              "px-2.5 py-1 cursor-pointer transition-colors",
              viewMode === "messages"
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Messages
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-1 pb-8">
          {items.map((item, i) => {
            if (isTurn(item)) {
              return (
                <TurnAccordion
                  key={`turn-${item.index}`}
                  turn={item}
                  viewMode={viewMode}
                  firstEpoch={firstEpoch}
                  onShowJson={(entry) => setJsonDialog({ data: entry })}
                />
              );
            }
            return (
              <LogRow
                key={i}
                entry={item}
                firstEpoch={firstEpoch}
                isFirst={i === 0}
                onShowJson={() => setJsonDialog({ data: item })}
              >
                <LogEntryContent entry={item} />
              </LogRow>
            );
          })}
        </div>
      </div>

      {jsonDialog && (
        <JsonDialog
          open
          onOpenChange={() => setJsonDialog(null)}
          data={jsonDialog.data}
          title="Raw JSON"
        />
      )}
    </div>
  );
}
