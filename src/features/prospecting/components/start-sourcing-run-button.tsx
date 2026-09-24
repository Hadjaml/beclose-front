"use client";

import { getApiErrorCode } from "@/shared/api/api-error-code";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useStartSourcingRunMutation } from "../api/use-start-sourcing-run-mutation";

/**
 * Simple, no-form button (`POST /organizations/{id}/sourcing-runs`, point
 * 18, 23/09/2026) — every request field is optional on Beclose's side and
 * this sends none, which is the "normal" case per Beclose's own docstring:
 * pilots sourcing from the organization's active ICP profile, tier 1.
 * Picking a sector/company/other tiers is a later step, not this one.
 *
 * Fire-and-forget: `202 Accepted` carries no completion signal, new leads
 * simply show up in the prospects list over time (no run-tracking in V1).
 */
function isAlreadyInProgress(error: unknown): boolean {
  return getApiErrorCode(error) === "SOURCING_RUN_ALREADY_IN_PROGRESS";
}

export function StartSourcingRunButton({ workspaceId }: { workspaceId: WorkspaceId }) {
  const mutation = useStartSourcingRunMutation(workspaceId);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        className="brand-gradient-action brand-gradient-hover rounded-app-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Lancement…" : "Lancer un sourcing"}
      </button>
      {mutation.isSuccess ? (
        <p className="text-sm text-text-secondary" role="status">
          Recherche lancée — les nouveaux prospects apparaîtront ici progressivement.
        </p>
      ) : null}
      {mutation.isError ? (
        <p className="text-sm text-red-700" role="alert">
          {isAlreadyInProgress(mutation.error)
            ? "Un sourcing est déjà en cours pour ce client."
            : "Impossible de lancer le sourcing. Réessayez dans quelques instants."}
        </p>
      ) : null}
    </div>
  );
}
