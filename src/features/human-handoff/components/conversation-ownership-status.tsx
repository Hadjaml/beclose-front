import type { ConversationOwnership } from "../model/handoff";

interface ConversationOwnershipStatusProps {
  ownership: ConversationOwnership;
}

export function ConversationOwnershipStatus({
  ownership,
}: ConversationOwnershipStatusProps) {
  if (ownership.owner === "HUMAN") {
    return (
      <section className="rounded-lg border border-blue-200 bg-blue-50 p-4" aria-label="Propriété de la conversation">
        <p className="text-sm font-semibold text-blue-950">
          Conversation reprise par un humain
        </p>
        {ownership.humanOwnerLabel === undefined ? null : (
          <p className="mt-1 text-sm text-blue-800">{ownership.humanOwnerLabel}</p>
        )}
        {ownership.agentState === "SUSPENDED" ? (
          <p className="mt-2 text-sm text-blue-800">Le système est suspendu.</p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4" aria-label="Propriété de la conversation">
      <p className="text-sm font-semibold text-zinc-950">Le système poursuit la conversation</p>
      <p className="mt-1 text-sm text-zinc-600">Supervision humaine disponible.</p>
    </section>
  );
}
