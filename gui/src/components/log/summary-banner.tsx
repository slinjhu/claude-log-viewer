import type { SummaryEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SummaryBanner({ entry }: { entry: SummaryEntry }) {
  const isError = entry.is_error;
  const durationSec = (entry.duration_ms / 1000).toFixed(1);
  const cost = entry.total_cost_usd.toFixed(4);
  const u = entry.usage;

  return (
    <div className={cn(
      "rounded-lg border p-4 text-sm",
      isError ? "border-destructive/50 bg-destructive/5" : "border-success/50 bg-success/5"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("font-bold", isError ? "text-destructive" : "text-success")}>
          {isError ? "Failed" : "Completed"}
        </span>
        <span className="text-muted-foreground">·</span>
        <span>{entry.num_turns} turns</span>
        <span className="text-muted-foreground">·</span>
        <span>{durationSec}s</span>
        <span className="text-muted-foreground">·</span>
        <span>${cost}</span>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Input: {u.input_tokens.toLocaleString()}</span>
        <span>Cache create: {u.cache_creation_input_tokens.toLocaleString()}</span>
        <span>Cache read: {u.cache_read_input_tokens.toLocaleString()}</span>
        <span>Output: {u.output_tokens.toLocaleString()}</span>
      </div>
    </div>
  );
}
