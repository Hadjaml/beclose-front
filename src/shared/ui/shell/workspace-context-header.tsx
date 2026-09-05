import type { WorkspaceId } from "@/shared/workspace/workspace";

export function WorkspaceSwitcherPlaceholder() {
  return (
    <button
      type="button"
      disabled
      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-500"
      title="Le sélecteur sera connecté lorsque les workspaces seront disponibles"
    >
      Changer de workspace
    </button>
  );
}

interface WorkspaceContextHeaderProps {
  workspaceId: WorkspaceId;
  showSwitcher?: boolean;
  label?: string;
  description?: string;
}

export function WorkspaceContextHeader({
  workspaceId,
  showSwitcher = true,
  label = "Workspace actif",
  description = "Vous travaillez actuellement dans l’environnement de ce client.",
}: WorkspaceContextHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-600">{label}</p>
        <h1 className="mt-1 break-all text-xl font-semibold tracking-tight text-zinc-950">{workspaceId}</h1>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      </div>
      {showSwitcher ? <WorkspaceSwitcherPlaceholder /> : null}
    </header>
  );
}
