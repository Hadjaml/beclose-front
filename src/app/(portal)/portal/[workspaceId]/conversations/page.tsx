import { ConversationsView } from "@/features/conversations";

export default function PortalConversationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Échanges en cours</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Conversations</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Suivez les échanges et identifiez ceux qui nécessitent votre intervention.
        </p>
      </header>
      <ConversationsView items={null} />
    </div>
  );
}
