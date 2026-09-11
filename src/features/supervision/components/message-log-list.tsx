import { EmptyState } from "@/shared/ui/states";
import {
  interactionDirectionLabels,
  interactionStatusLabels,
  type MessageLogEntry,
} from "../model/message-log";

export function MessageLogList({ messages }: { messages: readonly MessageLogEntry[] }) {
  if (messages.length === 0) {
    return (
      <EmptyState
        title="Aucun message pour le moment"
        description="Les messages générés et échangés apparaîtront ici."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((message) => (
        <li key={message.id} className="rounded-app-lg border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-tertiary">
            <span>
              {interactionDirectionLabels[message.direction]} · {message.channel}
              {message.status === null ? null : ` · ${interactionStatusLabels[message.status]}`}
            </span>
            <span>{message.sentAt ?? message.createdAt}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
            {message.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
