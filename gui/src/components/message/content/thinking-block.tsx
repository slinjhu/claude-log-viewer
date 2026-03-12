import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ThinkingContent } from "@/lib/types";
import { JsonButton } from "./json-button";
import { ExpandableBlock } from "./expandable-block";

export function ThinkingBlock({ item }: { item: ThinkingContent }) {
  const preview = item.thinking.replace(/\n/g, " ");

  return (
    <ExpandableBlock
      className="bg-card"
      icon={<Brain className="h-3.5 w-3.5 text-muted-foreground" />}
      label="ThinkingBlock"
      preview={preview}
      actions={<JsonButton data={item} title="ThinkingBlock" />}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.thinking}
        </ReactMarkdown>
      </div>
    </ExpandableBlock>
  );
}
