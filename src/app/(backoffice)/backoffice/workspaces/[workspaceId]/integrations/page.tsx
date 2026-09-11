import { WorkspaceIntegrationStatusSection } from "@/features/integrations";

export default function WorkspaceIntegrationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Outils du client</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Intégrations
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          État de la connexion Gmail utilisée pour l’envoi des messages.
        </p>
      </header>
      <WorkspaceIntegrationStatusSection />
    </div>
  );
}
