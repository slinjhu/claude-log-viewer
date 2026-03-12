import { Type } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TextContent } from "@/lib/types";
import { JsonButton } from "./json-button";
import { ExpandableBlock } from "./expandable-block";

export function TextBlock({ item }: { item: TextContent }) {
  const preview = item.text.split("\n")[0].slice(0, 120);

  return (
    <ExpandableBlock
      className="bg-card"
      icon={<Type className="h-3.5 w-3.5 text-muted-foreground" />}
      label="TextBlock"
      preview={preview}
      actions={<JsonButton data={item} title="TextBlock" />}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.text}
        </ReactMarkdown>
      </div>
    </ExpandableBlock>
  );
}
