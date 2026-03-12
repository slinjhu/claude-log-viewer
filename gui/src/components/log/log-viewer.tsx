"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLog } from "@/lib/api";
import type { LogEntry } from "@/lib/types";
import { LogRow } from "./log-row";
import { LogEntryContent } from "./log-entry";
import { JsonDialog } from "./json-dialog";

export function LogViewer() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonDialog, setJsonDialog] = useState<{ line: number; data: LogEntry } | null>(null);

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
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-1 pb-8">
          {entries.map((entry, i) => (
            <LogRow
              key={i}
              entry={entry}
              firstEpoch={firstEpoch}
              isFirst={i === 0}
              onShowJson={() => setJsonDialog({ line: i + 1, data: entry })}
            >
              <LogEntryContent entry={entry} />
            </LogRow>
          ))}
        </div>
      </div>

      {jsonDialog && (
        <JsonDialog
          open
          onOpenChange={() => setJsonDialog(null)}
          data={jsonDialog.data}
          title={`Line ${jsonDialog.line}`}
        />
      )}
    </div>
  );
}
