"use client";

import { useMessageLogQuery } from "@/features/supervision";
import { getApiErrorMessage } from "@/shared/api/api-error-code";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useRequestReevaluationMutation } from "../api/use-request-reevaluation-mutation";

const MAX_PAGE = 200;

/**
 * A qualification that failed is retried from here, without waiting for a new
 * reply from the prospect. Only the MOST RECENT inbound message counts, and
 * only Beclose's own `evaluationStatus` decides (`failed`/`exhausted` offer
 * the retry, `pending` says it is under way); anything else — including a
 * status this version does not know — shows nothing.
 */
export function ReevaluationPanel({ workspaceId, leadId }: { workspaceId: WorkspaceId; leadId: string }) {
  const messages = useMessageLogQuery(workspaceId, { leadId, limit: MAX_PAGE });
  const mutation = useRequestReevaluationMutation(workspaceId, leadId);

  if (!messages.isSuccess) return null;
  const latestInbound = messages.data.data
    .filter((message) => message.direction === "inbound")
    .sort((left, right) => Date.parse(right.sentAt ?? right.createdAt) - Date.parse(left.sentAt ?? left.createdAt))[0];
  const status = latestInbound?.evaluationStatus ?? null;
  const attempts = latestInbound?.evaluationAttempts ?? null;

  if (mutation.isSuccess) {
    return (
      <section role="status" className="rounded-app-lg border border-sky-200 bg-sky-50 p-5">
        <p className="text-sm font-semibold text-sky-950">Réévaluation demandée</p>
        <p className="mt-1 text-sm text-sky-900">
          L’évaluation reprendra dans moins d’une minute ; le résultat apparaîtra sur cette fiche.
        </p>
      </section>
    );
  }

  if (status === "pending") {
    return (
      <section role="status" className="rounded-app-lg border border-border bg-surface-muted p-5">
        <p className="text-sm text-text-secondary">Évaluation en cours ou à reprendre pour la dernière réponse.</p>
      </section>
    );
  }

  if (status !== "failed" && status !== "exhausted") return null;

  return (
    <section className="space-y-3 rounded-app-lg border border-amber-200 bg-amber-50 p-5">
      <h2 className="text-lg font-semibold text-amber-950">Évaluation en échec</h2>
      <p className="text-sm text-amber-900">
        L’évaluation de la dernière réponse a échoué
        {status === "exhausted"
          ? ` après ${attempts ?? 3} tentatives automatiques : elles sont épuisées et une alerte a déjà été envoyée au back-office.`
          : attempts === null
            ? "."
            : ` (${attempts} tentative${attempts > 1 ? "s" : ""}).`}{" "}
        Sans nouvelle réponse du prospect, elle ne sera pas reprise seule.
      </p>
      {mutation.isError ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {getApiErrorMessage(mutation.error) ?? "Impossible de relancer l’évaluation. Réessayez dans quelques instants."}
        </p>
      ) : null}
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        className="rounded-app-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Demande…" : "Relancer l’évaluation"}
      </button>
    </section>
  );
}
