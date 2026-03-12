import type { LogEntry, InitEntry, MessageEntry, SummaryEntry } from "@/lib/types";
import { pyClass } from "@/lib/types";
import { SystemMessage } from "@/components/message/system";
import { AssistantMessage } from "@/components/message/assistant";
import { UserMessage } from "@/components/message/user";
import { ResultMessage } from "@/components/message/result";

/** Renders the expanded content of a log entry (no header). */
export function LogEntryContent({ entry }: { entry: LogEntry }) {
  switch (pyClass(entry)) {
    case "SystemMessage":
      return <SystemMessage entry={entry as InitEntry} />;
    case "AssistantMessage":
      return <AssistantMessage entry={entry as MessageEntry} />;
    case "UserMessage":
      return <UserMessage entry={entry as MessageEntry} />;
    case "ResultMessage":
      return <ResultMessage entry={entry as SummaryEntry} />;
    default:
      return null;
  }
}
