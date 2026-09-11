import { ConversationsView } from "@/features/conversations";
import { MessageLogSection } from "@/features/supervision";

export default function WorkspaceConversationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Décisions et échanges</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Conversations
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Comprenez les échanges en cours, ce que le système a identifié et les interventions attendues.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
        <p className="text-sm text-text-secondary">
          Supervision en lecture seule — l’approbation des messages en attente reste gérée sur Telegram.
        </p>
        <MessageLogSection />
      </section>

      <ConversationsView items={null} />
    </div>
  );
}
