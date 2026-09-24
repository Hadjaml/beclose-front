"use client";

import Link from "next/link";
import { sourcingBlockerLabel } from "@/features/client-configuration";
import { getApiErrorCode, getApiErrorDetails, getApiErrorMessage } from "@/shared/api/api-error-code";
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

/** A run known to fail (e.g. an ICP profile with nothing to target) is not
 * offered: the composition layer passes why, and where to fix it. */
function isPreconditionFailed(error: unknown): boolean {
  return getApiErrorCode(error) === "SOURCING_PRECONDITION_FAILED";
}

export interface SourcingRunBlock {
  reasons: readonly string[];
  fixHref: string;
}

/** The blockers of a `422 SOURCING_PRECONDITION_FAILED`, in French. Beclose's
 * own message stands in when the list is missing or unreadable. */
function preconditionReasons(error: unknown): string[] {
  const details = getApiErrorDetails(error);
  const blockers =
    typeof details === "object" && details !== null && "blockers" in details && Array.isArray(details.blockers)
      ? details.blockers.filter((blocker): blocker is string => typeof blocker === "string")
      : [];
  if (blockers.length > 0) return blockers.map(sourcingBlockerLabel);
  return [getApiErrorMessage(error) ?? "Le sourcing ne peut pas démarrer : la configuration du client est incomplète."];
}

export function StartSourcingRunButton({
  workspaceId,
  blocked,
  fixHref,
}: {
  workspaceId: WorkspaceId;
  blocked?: SourcingRunBlock;
  /** Where the ICP profile is corrected, for a refusal Beclose reports. */
  fixHref?: string;
}) {
  const mutation = useStartSourcingRunMutation(workspaceId);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={mutation.isPending || blocked !== undefined}
        onClick={() => mutation.mutate()}
        className="brand-gradient-action brand-gradient-hover rounded-app-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Lancement…" : "Lancer un sourcing"}
      </button>
      {blocked === undefined ? null : (
        <div role="status" className="max-w-md text-sm text-red-800">
          {blocked.reasons.map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
          <Link href={blocked.fixHref} className="font-semibold underline underline-offset-2">
            Corriger le profil ICP
          </Link>
        </div>
      )}
      {mutation.isSuccess ? (
        <p className="text-sm text-text-secondary" role="status">
          Recherche lancée — les nouveaux prospects apparaîtront ici progressivement.
        </p>
      ) : null}
      {mutation.isError && isPreconditionFailed(mutation.error) ? (
        <div role="alert" className="max-w-md text-sm text-red-800">
          <p className="font-semibold">Le sourcing ne peut pas démarrer :</p>
          {preconditionReasons(mutation.error).map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
          {fixHref === undefined ? null : (
            <Link href={fixHref} className="font-semibold underline underline-offset-2">
              Corriger le profil ICP
            </Link>
          )}
        </div>
      ) : null}
      {mutation.isError && !isPreconditionFailed(mutation.error) ? (
        <p className="text-sm text-red-700" role="alert">
          {isAlreadyInProgress(mutation.error)
            ? "Un sourcing est déjà en cours pour ce client."
            : "Impossible de lancer le sourcing. Réessayez dans quelques instants."}
        </p>
      ) : null}
    </div>
  );
}
