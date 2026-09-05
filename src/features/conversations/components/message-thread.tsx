import { contactChannelLabels } from "@/features/prospecting";
import {
  conversationParticipantKindLabels,
  type Conversation,
} from "../model/conversation";

interface MessageThreadProps {
  conversation: Conversation;
  formatTimestamp: (timestamp: string) => string;
}

export function MessageThread({ conversation, formatTimestamp }: MessageThreadProps) {
  const participantNames = new Map(
    conversation.participants.map((participant) => [
      participant.id,
      participant.displayName,
    ]),
  );

  return (
    <section aria-labelledby="conversation-thread-title" className="min-h-96 rounded-xl border border-zinc-200 bg-white">
      <header className="border-b border-zinc-100 px-5 py-4">
        <h2 id="conversation-thread-title" className="text-base font-semibold text-zinc-950">
          Fil de conversation
        </h2>
        {conversation.channel === undefined ? null : (
          <p className="mt-1 text-sm text-zinc-600">{contactChannelLabels[conversation.channel]}</p>
        )}
      </header>
      {conversation.messages.length === 0 ? (
        <p className="p-6 text-sm text-zinc-600">Aucun message disponible.</p>
      ) : (
        <ol className="space-y-5 p-5">
          {conversation.messages.map((message) => {
            const isProspect = message.authorKind === "PROSPECT";
            const author =
              participantNames.get(message.participantId) ??
              conversationParticipantKindLabels[message.authorKind];

            return (
              <li key={message.id} className={isProspect ? "mr-8" : "ml-8"}>
                <div className={isProspect ? "rounded-xl bg-zinc-100 p-4" : "rounded-xl bg-blue-50 p-4"}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-950">{author}</p>
                    <span className="text-xs font-medium text-zinc-500">
                      {conversationParticipantKindLabels[message.authorKind]}
                    </span>
                  </div>
                  {message.content === undefined ? null : (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{message.content}</p>
                  )}
                  {message.sentAt === undefined ? null : (
                    <time dateTime={message.sentAt} className="mt-2 block text-xs text-zinc-500">
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
