"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Braces } from "lucide-react";
import { fetchLog } from "@/lib/api";
import type { LogEntry } from "@/lib/types";
import { LogEntryView } from "./log-entry";
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
        <div className="space-y-3 pb-8">
          {entries.map((entry, i) => (
            <div key={i} className="flex gap-2">
              {/* Line number */}
              <div className="flex flex-col items-center pt-2 shrink-0 w-8">
                <span className="text-xs font-mono text-muted-foreground select-none">
                  {i + 1}
                </span>
              </div>

              {/* Entry content */}
              <div className="flex-1 min-w-0">
                <LogEntryView entry={entry} />
              </div>

              {/* JSON button */}
              <div className="flex flex-col items-center pt-2 shrink-0">
                <button
                  onClick={() => setJsonDialog({ line: i + 1, data: entry })}
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
                  title="View raw JSON"
                >
                  <Braces className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
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
