import { interactionStatusLabel, type MessageLogEntry } from "@/features/supervision";
import { formatDateTime } from "@/shared/format/format-date-time";
import { splitQuotedReply } from "../model/quoted-reply";
import { chatMessageKind, sortChronologically, type ChatMessageKind } from "../model/chat-message";

const bubbleClass: Record<ChatMessageKind, string> = {
  received: "mr-10 self-start rounded-bl-sm bg-surface-muted text-text-primary",
  sent: "ml-10 self-end rounded-br-sm bg-brand-blue-violet text-white",
  awaiting: "ml-10 self-end rounded-br-sm border border-dashed border-amber-400 bg-amber-50 text-amber-950",
  discarded:
    "ml-10 self-end rounded-br-sm border border-dashed border-border-strong bg-surface text-text-tertiary",
  unknown: "mx-10 self-center border border-dashed border-border bg-surface text-text-secondary",
};

/** What must be said about a message that is not a real, exchanged one. */
function notice(message: MessageLogEntry, kind: ChatMessageKind): string | null {
  switch (kind) {
    case "received":
    case "sent":
      return null;
    case "awaiting":
      return `Brouillon, pas encore envoyé — ${message.status === null ? "" : interactionStatusLabel(message.status)}`;
    case "discarded":
      return `Jamais envoyé — ${message.status === null ? "" : interactionStatusLabel(message.status)}`;
    case "unknown":
      return message.status === null ? "Statut inconnu" : interactionStatusLabel(message.status);
  }
}

/** One prospect's exchange as a chat: prospect on the left, Bewise on the
 * right, oldest first. Drafts and discarded messages stay visible (the
 * history is an audit) but are dashed and labelled so they cannot be taken
 * for something the prospect received. */
export function ChatThread({ messages }: { messages: readonly MessageLogEntry[] }) {
  if (messages.length === 0) {
    return <p className="p-6 text-sm text-text-secondary">Aucun message dans cette conversation</p>;
  }

  return (
    <ol className="flex flex-col gap-3 p-4 sm:p-5">
      {sortChronologically(messages).map((message) => {
        const kind = chatMessageKind(message);
        const note = notice(message, kind);
        // Only what the prospect wrote is split: their reply quotes our
        // earlier message, which would otherwise appear twice.
        const { fresh, quoted } =
          kind === "received" ? splitQuotedReply(message.content) : { fresh: message.content, quoted: null };
        return (
          <li
            key={message.id}
            id={`message-${message.id}`}
            data-kind={kind}
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${bubbleClass[kind]}`}
          >
            {note === null ? null : <p className="mb-1 text-xs font-semibold">{note}</p>}
            <p className="whitespace-pre-wrap text-sm leading-6">{fresh}</p>
            {quoted === null ? null : (
              <details className="mt-2 text-xs opacity-80">
                <summary className="cursor-pointer font-medium">Afficher le message cité</summary>
                <p className="mt-1 whitespace-pre-wrap border-l-2 border-border-strong pl-3">{quoted}</p>
              </details>
            )}
            <p className="mt-1 text-xs opacity-75">
              {message.channel} · {formatDateTime(message.sentAt ?? message.createdAt)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
