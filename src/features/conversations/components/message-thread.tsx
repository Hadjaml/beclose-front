import { contactChannelLabels } from "@/features/prospecting";
import {
  conversationParticipantKindLabels,
  type Conversation,
} from "../model/conversation";

interface MessageThreadProps {
  conversation: Conversation;
  formatTimestamp: (timestamp: string) => string;
}

const messageTone = {
  PROSPECT: "bg-surface-muted",
  BEWISE_AGENT: "border border-brand-blue/15 bg-brand-soft",
  HUMAN: "border border-brand-navy/15 bg-surface",
} as const;

export function MessageThread({ conversation, formatTimestamp }: MessageThreadProps) {
  const participantNames = new Map(
    conversation.participants.map((participant) => [
      participant.id,
      participant.displayName,
    ]),
  );

  return (
    <section aria-labelledby="conversation-thread-title" className="min-h-96 rounded-app-lg border border-border bg-surface">
      <header className="border-b border-border px-5 py-4">
        <h2 id="conversation-thread-title" className="text-base font-semibold text-text-primary">
          Fil de conversation
        </h2>
        {conversation.channel === undefined ? null : (
          <p className="mt-1 text-sm text-text-secondary">{contactChannelLabels[conversation.channel]}</p>
        )}
      </header>
      {conversation.messages.length === 0 ? (
        <p className="p-6 text-sm text-text-secondary">Aucun message disponible.</p>
      ) : (
        <ol className="space-y-5 p-5">
          {conversation.messages.map((message) => {
            const isProspect = message.authorKind === "PROSPECT";
            const author =
              participantNames.get(message.participantId) ??
              conversationParticipantKindLabels[message.authorKind];

            return (
              <li key={message.id} className={isProspect ? "mr-8" : "ml-8"}>
                <div className={`rounded-app-lg p-4 ${messageTone[message.authorKind]}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text-primary">{author}</p>
                    <span className="text-xs font-medium text-text-tertiary">
                      {conversationParticipantKindLabels[message.authorKind]}
                    </span>
                  </div>
                  {message.content === undefined ? null : (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-primary">{message.content}</p>
                  )}
                  {message.sentAt === undefined ? null : (
                    <time dateTime={message.sentAt} className="mt-2 block text-xs text-text-tertiary">
                      {formatTimestamp(message.sentAt)}
                    </time>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
