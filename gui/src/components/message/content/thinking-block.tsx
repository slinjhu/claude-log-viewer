import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ThinkingContent } from "@/lib/types";
import { JsonButton } from "./json-button";

export function ThinkingBlock({ item }: { item: ThinkingContent }) {
  return (
    <div className="rounded-md border border-obvious-border p-3">
      <div className="flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">ThinkingBlock</span>
        <JsonButton data={item} title="ThinkingBlock" />
      </div>
      <div className="mt-1 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.thinking}
        </ReactMarkdown>
      </div>
    </div>
  );
}
