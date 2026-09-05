import { WorkspaceOverviewView } from "@/features/supervision";

export default function BackofficeWorkspacePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Supervision</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Vue d’ensemble
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez ici l’état du système et les prochaines interventions utiles.
        </p>
      </header>

      <WorkspaceOverviewView supervision={null} />
    </div>
  );
}
