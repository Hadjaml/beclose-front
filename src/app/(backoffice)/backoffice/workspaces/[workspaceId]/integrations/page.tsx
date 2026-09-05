import { IntegrationsView } from "@/features/integrations";

export default function WorkspaceIntegrationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Outils du client</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Intégrations
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez les connexions du workspace et ce que chacune permet réellement.
        </p>
      </header>
      <IntegrationsView integrations={null} />
    </div>
  );
}
