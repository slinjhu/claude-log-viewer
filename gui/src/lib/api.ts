import type { LogEntry } from "./types";

const API_BASE = "/api";

export interface LogResponse {
  path: string;
  filename: string;
  entries: LogEntry[];
}

export async function fetchLog(filePath: string): Promise<LogResponse> {
  const res = await fetch(`${API_BASE}/log?file=${encodeURIComponent(filePath)}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to load log");
  }
  return res.json();
}
