import Link from "next/link";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * The switcher is a plain link to wherever the composition layer says the
 * workspace list lives. It used to be a permanently `disabled` placeholder
 * button ("sera connecté lorsque les workspaces seront disponibles") that
 * outlived the moment they became available — a real user hit it as a button
 * that "does nothing" (2026-09-24). No `switcherHref` → no switcher rendered
 * (a control is shown only when it has somewhere real to go, e.g. the client
 * portal, where a client must not browse other workspaces).
 */
export function WorkspaceSwitcherLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded-app-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
    >
      Changer de workspace
    </Link>
  );
}

interface WorkspaceContextHeaderProps {
  workspaceId: WorkspaceId;
  /** The client's name — the main title when known; the identifier stays as
   * a small reference (support, CLI commands) instead of being the title. */
  workspaceName?: string;
  /** Where "Changer de workspace" leads; omit to show no switcher. */
  switcherHref?: string;
  label?: string;
  description?: string;
}

export function WorkspaceContextHeader({
  workspaceId,
  workspaceName,
  switcherHref,
  label = "Workspace actif",
  description = "Vous travaillez actuellement dans l’environnement de ce client.",
}: WorkspaceContextHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-app-lg border border-border bg-surface px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        <h1 className="mt-1 break-words text-xl font-semibold tracking-tight text-brand-navy">
          {workspaceName ?? workspaceId}
        </h1>
        {workspaceName === undefined ? null : (
          <p className="mt-0.5 break-all text-xs text-text-tertiary">Identifiant : {workspaceId}</p>
        )}
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {switcherHref === undefined ? null : <WorkspaceSwitcherLink href={switcherHref} />}
    </header>
  );
}
