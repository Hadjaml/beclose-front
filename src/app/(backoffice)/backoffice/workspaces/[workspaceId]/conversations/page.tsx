import { ProspectConversationsSection } from "@/features/conversations";

export default function WorkspaceConversationsPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Décisions et échanges</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Conversations
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Les échanges avec chaque prospect, du plus ancien au plus récent. Les brouillons et les
          messages rejetés, remplacés ou annulés restent visibles mais sont signalés comme jamais
          envoyés. Lecture seule : l’approbation reste gérée sur Telegram.
        </p>
      </header>

      <ProspectConversationsSection />
    </div>
  );
}
