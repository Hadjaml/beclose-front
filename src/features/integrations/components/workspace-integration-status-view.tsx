import { formatDateTime } from "@/shared/format/format-date-time";
import { EmptyState } from "@/shared/ui/states";
import { googleConnectionHealth, googleFailureReasonLabel } from "../model/google-connection-health";
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
  const health = googleConnectionHealth(google);
  const failureReason = googleFailureReasonLabel(google.lastFailureReason);

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-app-lg border border-border bg-surface p-5">
        <dt className="text-sm font-semibold text-text-primary">Gmail</dt>
        <dd className="mt-2 text-sm font-semibold text-text-primary">{health.label}</dd>
        {health.description === "" ? null : (
          <dd className="mt-1 text-sm text-text-secondary">{health.description}</dd>
        )}
        {google.lastSuccessAt === null ? null : (
          <dd className="mt-1 text-xs text-text-tertiary">
            Dernier succès : {formatDateTime(google.lastSuccessAt)}
          </dd>
        )}
        {google.lastFailureAt === null && failureReason === null ? null : (
          <dd className="mt-1 text-xs text-text-tertiary">
            {google.lastFailureAt === null ? "Dernier échec" : `Dernier échec : ${formatDateTime(google.lastFailureAt)}`}
            {failureReason === null ? "" : ` — ${failureReason}`}
          </dd>
        )}
        {google.expiresAt === null ? null : (
          <dd className="mt-1 text-xs text-text-tertiary">
            Jeton d’accès valable jusqu’au {formatDateTime(google.expiresAt)} (il se renouvelle seul)
          </dd>
        )}
        {google.scopes.length === 0 ? null : (
          <dd className="mt-2 text-xs text-text-tertiary">{google.scopes.join(", ")}</dd>
        )}
      </div>
    </dl>
  );
}
