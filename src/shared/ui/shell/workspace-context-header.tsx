import type { WorkspaceId } from "@/shared/workspace/workspace";

export function WorkspaceSwitcherPlaceholder() {
  return (
    <button
      type="button"
      disabled
      className="rounded-app-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-tertiary"
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
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-app-lg border border-border bg-surface px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        <h1 className="mt-1 break-all text-xl font-semibold tracking-tight text-brand-navy">{workspaceId}</h1>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {showSwitcher ? <WorkspaceSwitcherPlaceholder /> : null}
    </header>
  );
}
