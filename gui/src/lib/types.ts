/** A single content item within a log entry. */
export interface ThinkingContent {
  thinking: string;
  signature?: string;
}

export interface TextContent {
  text: string;
}

export interface ToolUseContent {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultContent {
  tool_use_id: string;
  content: string;
  is_error: boolean | null;
}

export type ContentItem = ThinkingContent | TextContent | ToolUseContent | ToolResultContent;

/** Init event — first line of a session log. */
export interface InitEntry {
  subtype: "init";
  data: {
    type: string;
    subtype: string;
    cwd: string;
    session_id: string;
    tools: string[];
    model: string;
    claude_code_version: string;
    permissionMode: string;
    [key: string]: unknown;
  };
}

/** Assistant message or tool result. */
export interface MessageEntry {
  content: ContentItem[];
  model?: string;
  parent_tool_use_id: string | null;
  error: string | null;
  uuid?: string;
  tool_use_result?: Record<string, unknown>;
}

/** Summary event — last line of a session log. */
export interface SummaryEntry {
  subtype: "success" | "error";
  duration_ms: number;
  duration_api_ms: number;
  is_error: boolean;
  num_turns: number;
  session_id: string;
  total_cost_usd: number;
  usage: {
    input_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    output_tokens: number;
    [key: string]: unknown;
  };
  result: string;
  [key: string]: unknown;
}

export type LogEntry = InitEntry | MessageEntry | SummaryEntry;

// Type guards
export function isInitEntry(entry: LogEntry): entry is InitEntry {
  return "subtype" in entry && entry.subtype === "init";
}

export function isSummaryEntry(entry: LogEntry): entry is SummaryEntry {
  return "subtype" in entry && (entry.subtype === "success" || entry.subtype === "error");
}

export function isMessageEntry(entry: LogEntry): entry is MessageEntry {
  return "content" in entry && Array.isArray(entry.content);
}

export function isThinking(item: ContentItem): item is ThinkingContent {
  return "thinking" in item;
}

export function isText(item: ContentItem): item is TextContent {
  return "text" in item;
}

export function isToolUse(item: ContentItem): item is ToolUseContent {
  return "name" in item && "input" in item;
}

export function isToolResult(item: ContentItem): item is ToolResultContent {
  return "tool_use_id" in item;
}
