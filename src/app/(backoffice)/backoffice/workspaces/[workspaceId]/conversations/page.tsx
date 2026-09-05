import { ConversationsView } from "@/features/conversations";

export default function WorkspaceConversationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Décisions et échanges</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Conversations
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Comprenez les échanges en cours, ce que le système a identifié et les interventions attendues.
        </p>
      </header>

      <ConversationsView items={null} />
    </div>
  );
}
