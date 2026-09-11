import { EmptyState } from "@/shared/ui/states";
import type { WorkspaceIntegrationStatus } from "../model/workspace-integration-status";

export function WorkspaceIntegrationStatusView({
  status,
}: {
  status: WorkspaceIntegrationStatus;
}) {
  if (status.google === null) {
    return (
      <EmptyState
        title="Aucune intégration connectée"
        description="Gmail n’a pas encore été connecté pour ce client (connexion faite par Bewise à l’onboarding)."
      />
    );
  }

  const { google } = status;

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-app-lg border border-border bg-surface p-5">
        <dt className="text-sm font-semibold text-text-primary">Gmail</dt>
        <dd className="mt-2 text-sm text-text-secondary">
          {google.connected ? "Connecté" : "Reconnexion nécessaire"}
        </dd>
        {google.expiresAt === null ? null : (
          <dd className="mt-1 text-xs text-text-tertiary">Expire le {google.expiresAt}</dd>
        )}
        {google.scopes.length === 0 ? null : (
          <dd className="mt-2 text-xs text-text-tertiary">{google.scopes.join(", ")}</dd>
        )}
      </div>
    </dl>
  );
}
