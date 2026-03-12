import { Type } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TextContent } from "@/lib/types";
import { JsonButton } from "./json-button";

export function TextBlock({ item }: { item: TextContent }) {
  return (
    <div className="rounded-md border border-obvious-border bg-card p-3">
      <div className="flex items-center gap-1.5">
        <Type className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">TextBlock</span>
        <JsonButton data={item} title="TextBlock" />
      </div>
      <div className="mt-1 prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
