import { LeadPipelineSection, WorkspaceOverviewView } from "@/features/supervision";

export default function BackofficeWorkspacePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Supervision</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Vue d’ensemble
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Retrouvez ici l’état du système et les prochaines interventions utiles.
        </p>
      </header>

      <LeadPipelineSection />
      <WorkspaceOverviewView supervision={null} />
    </div>
  );
}
