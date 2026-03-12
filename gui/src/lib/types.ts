/** Common fields present on every log entry line (jsonpickle format). */
export interface BaseEntry {
  "py/object"?: string;
  _epoch?: number;
}

/** Extract the short class name from a py/object string. */
export function pyClass(entry: BaseEntry): string | undefined {
  const full = entry["py/object"];
  if (!full) return undefined;
  const parts = full.split(".");
  return parts[parts.length - 1];
}

/** A single content item within a log entry. */
export interface ThinkingContent {
  "py/object"?: string;
  thinking: string;
  signature?: string;
}

export interface TextContent {
  "py/object"?: string;
  text: string;
}

export interface ToolUseContent {
  "py/object"?: string;
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultContent {
  "py/object"?: string;
  tool_use_id: string;
  content: string | null;
  is_error: boolean | null;
}

export type ContentItem = ThinkingContent | TextContent | ToolUseContent | ToolResultContent;

/** Extract short class name from a content item. */
export function contentClass(item: ContentItem): string | undefined {
  const full = (item as { "py/object"?: string })["py/object"];
  if (!full) return undefined;
  const parts = full.split(".");
  return parts[parts.length - 1];
}

/** SystemMessage — first line of a session log. */
export interface InitEntry extends BaseEntry {
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

/** AssistantMessage or UserMessage. */
export interface MessageEntry extends BaseEntry {
  content: ContentItem[];
  model?: string;
  parent_tool_use_id: string | null;
  error: string | null;
  uuid?: string;
  tool_use_result?: Record<string, unknown>;
}

/** ResultMessage — last line of a session log. */
export interface SummaryEntry extends BaseEntry {
  subtype: "success" | "error";
  duration_ms: number;
  duration_api_ms: number;
  is_error: boolean;
  num_turns: number;
  session_id: string;
  total_cost_usd: number | null;
  usage: {
    input_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    output_tokens: number;
    [key: string]: unknown;
  } | null;
  result: string | null;
  [key: string]: unknown;
}

export type LogEntry = InitEntry | MessageEntry | SummaryEntry;

// Type guards based on py/object
export function isInitEntry(entry: LogEntry): entry is InitEntry {
  return pyClass(entry) === "SystemMessage";
}

export function isSummaryEntry(entry: LogEntry): entry is SummaryEntry {
  return pyClass(entry) === "ResultMessage";
}

export function isMessageEntry(entry: LogEntry): entry is MessageEntry {
  const cls = pyClass(entry);
  return cls === "AssistantMessage" || cls === "UserMessage";
}

// Content type guards based on py/object
export function isThinking(item: ContentItem): item is ThinkingContent {
  return contentClass(item) === "ThinkingBlock";
}

export function isText(item: ContentItem): item is TextContent {
  return contentClass(item) === "TextBlock";
}

export function isToolUse(item: ContentItem): item is ToolUseContent {
  return contentClass(item) === "ToolUseBlock";
}

export function isToolResult(item: ContentItem): item is ToolResultContent {
  return contentClass(item) === "ToolResultBlock";
}
