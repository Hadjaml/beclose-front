import { WorkspaceOverviewView } from "@/features/supervision";

export default function PortalPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Votre espace Bewise</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Vue d’ensemble
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez ce qui nécessite votre attention, l’activité récente et les résultats disponibles.
        </p>
      </header>
      <WorkspaceOverviewView supervision={null} />
    </div>
  );
}
