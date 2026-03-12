import type { InitEntry } from "@/lib/types";

export function SystemMessage({ entry }: { entry: InitEntry }) {
  const d = entry.data;
  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-base">Session</span>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{d.model}</span>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">v{d.claude_code_version}</span>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{d.permissionMode}</span>
      </div>
      <div className="text-muted-foreground space-y-0.5">
        <div><span className="font-medium text-foreground">cwd:</span> {d.cwd}</div>
        <div><span className="font-medium text-foreground">session:</span> <span className="font-mono text-xs">{d.session_id}</span></div>
        <div><span className="font-medium text-foreground">tools:</span> {d.tools.length} available</div>
      </div>
    </div>
  );
}
