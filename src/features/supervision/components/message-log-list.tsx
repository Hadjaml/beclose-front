import { formatDateTime } from "@/shared/format/format-date-time";
import { EmptyState } from "@/shared/ui/states";
import {
  interactionDirectionLabel,
  interactionStatusLabel,
  type MessageLogEntry,
} from "../model/message-log";

export function MessageLogList({
  messages,
  highlightedMessageId,
}: {
  messages: readonly MessageLogEntry[];
  /** Anchors and visually highlights one message — used by the prospect
   * detail view to jump from a BANT criterion's evidence to the message it
   * came from (`sourceInteractionId`). */
  highlightedMessageId?: string;
}) {
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
        <li
          key={message.id}
          id={`message-${message.id}`}
          className={`rounded-app-lg border p-4 ${
            message.id === highlightedMessageId
              ? "border-brand-blue-violet bg-brand-blue-violet/5"
              : "border-border bg-surface"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-tertiary">
            <span>
              {interactionDirectionLabel(message.direction)} · {message.channel}
              {message.status === null ? null : ` · ${interactionStatusLabel(message.status)}`}
            </span>
            <span>{formatDateTime(message.sentAt ?? message.createdAt)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
            {message.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
