import { formatDateTime } from "@/shared/format/format-date-time";
import { EmptyState } from "@/shared/ui/states";
import { googleConnectionHealth, googleFailureReasonLabel } from "../model/google-connection-health";
import { notionConnectionHealth, notionFailureReasonLabel } from "../model/notion-connection-health";
import type {
  GoogleIntegrationStatus,
  NotionIntegrationStatus,
  WorkspaceIntegrationStatus,
} from "../model/workspace-integration-status";

function GmailCard({ google }: { google: GoogleIntegrationStatus | null }) {
  const health = googleConnectionHealth(google);
  const failureReason = googleFailureReasonLabel(google?.lastFailureReason ?? null);

  return (
    <div className="rounded-app-lg border border-border bg-surface p-5">
      <dt className="text-sm font-semibold text-text-primary">Gmail</dt>
      <dd className="mt-2 text-sm font-semibold text-text-primary">{health.label}</dd>
      {health.description === "" ? null : (
        <dd className="mt-1 text-sm text-text-secondary">{health.description}</dd>
      )}
      {google === null ? null : (
        <>
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
        </>
      )}
    </div>
  );
}

function NotionCard({ notion }: { notion: NotionIntegrationStatus | null }) {
  const health = notionConnectionHealth(notion);
  const failureReason = notionFailureReasonLabel(notion?.lastFailureReason ?? null);

  return (
    <div className="rounded-app-lg border border-border bg-surface p-5">
      <dt className="text-sm font-semibold text-text-primary">Notion</dt>
      <dd className="mt-2 text-sm font-semibold text-text-primary">{health.label}</dd>
      {health.description === "" ? null : (
        <dd className="mt-1 text-sm text-text-secondary">{health.description}</dd>
      )}
      {notion === null ? null : (
        <>
          {notion.lastSuccessAt === null ? null : (
            <dd className="mt-1 text-xs text-text-tertiary">
              Dernier succès : {formatDateTime(notion.lastSuccessAt)}
            </dd>
          )}
          {notion.lastFailureAt === null && failureReason === null ? null : (
            <dd className="mt-1 text-xs text-text-tertiary">
              {notion.lastFailureAt === null ? "Dernier échec" : `Dernier échec : ${formatDateTime(notion.lastFailureAt)}`}
              {failureReason === null ? "" : ` — ${failureReason}`}
            </dd>
          )}
          <dd className="mt-3 grid grid-cols-2 gap-3">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                En attente de copie
              </span>
              <span className="text-lg font-semibold tabular-nums text-text-primary">{notion.pendingSyncs}</span>
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Échecs définitifs
              </span>
              <span className="text-lg font-semibold tabular-nums text-text-primary">{notion.exhaustedSyncs}</span>
            </span>
          </dd>
          {notion.exhaustedSyncs === 0 ? null : (
            <dd className="mt-2 text-xs text-amber-900">
              Ces prospects n’ont pas pu être copiés dans Notion : reprises épuisées, elles ne repartiront pas seules.
            </dd>
          )}
        </>
      )}
    </div>
  );
}

export function WorkspaceIntegrationStatusView({
  status,
}: {
  status: WorkspaceIntegrationStatus;
}) {
  if (status.google === null && status.notion === null) {
    return (
      <EmptyState
        title="Aucune intégration connectée"
        description="Ni Gmail ni Notion n’ont encore été connectés pour ce client (connexions faites par Bewise à l’onboarding)."
      />
    );
  }

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <GmailCard google={status.google} />
      <NotionCard notion={status.notion} />
    </dl>
  );
}
