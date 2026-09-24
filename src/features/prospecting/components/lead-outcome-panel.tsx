"use client";

import { useState } from "react";
import { getApiErrorCode, getApiErrorMessage } from "@/shared/api/api-error-code";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useSetLeadOutcomeMutation } from "../api/use-set-lead-outcome-mutation";
import {
  availableOutcomeActions,
  leadOutcomeLabel,
  type KnownLeadOutcome,
  type LeadOutcome,
  type LeadStatus,
} from "../model/lead-prospect";

const confirmations: Record<KnownLeadOutcome, { title: string; points: readonly string[] }> = {
  won: {
    title: "Marquer ce prospect comme gagné ?",
    points: [
      "Le prospect passe au statut « Converti ».",
      "« Converti » est un état final : une erreur de saisie sur « gagné » ne se corrige pas depuis l’interface (il faudrait une intervention manuelle en base).",
    ],
  },
  lost: {
    title: "Marquer ce prospect comme perdu ?",
    points: [
      "Le statut du prospect ne change pas.",
      "Vous pourrez encore le marquer « gagné » plus tard s’il finit par signer.",
    ],
  },
};

function refusalMessage(error: unknown): string {
  if (getApiErrorCode(error) === "OUTCOME_NOT_ALLOWED") {
    // Beclose's own wording says exactly why (e.g. already won, terminal).
    return getApiErrorMessage(error) ?? "Cette issue ne peut pas être enregistrée dans l’état actuel du prospect.";
  }
  return "Impossible d’enregistrer l’issue. Réessayez dans quelques instants.";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { dateStyle: "long" });
}

/**
 * Outcome of a *transmitted* lead ("gagné"/"perdu"), declared by hand — the
 * CRM feedback that would send it automatically does not exist yet. Renders
 * nothing for a lead that was never transmitted (`booked`/`handed_off`/
 * `converted`, Beclose's own list): an outcome means nothing before that.
 * Shows the outcome already declared, and only the actions Beclose would
 * accept (`availableOutcomeActions`).
 */
export function LeadOutcomePanel({
  workspaceId,
  leadId,
  status,
  outcome,
  outcomeAt,
}: {
  workspaceId: WorkspaceId;
  leadId: string;
  status: LeadStatus;
  outcome: LeadOutcome | null;
  outcomeAt: string | null;
}) {
  const [pending, setPending] = useState<KnownLeadOutcome | null>(null);
  const mutation = useSetLeadOutcomeMutation(workspaceId, leadId);
  const actions = availableOutcomeActions({ status, outcome });

  // Not transmitted (and nothing declared): nothing to show.
  if (actions.length === 0 && outcome === null) return null;

  return (
    <section className="space-y-3 rounded-app-lg border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">Issue commerciale</h2>

      <p className="text-sm text-text-secondary">
        {outcome === null ? (
          "Aucune issue déclarée pour l’instant."
        ) : (
          <>
            Déclarée :{" "}
            <span className={outcome === "won" ? "font-semibold text-emerald-800" : "font-semibold text-text-primary"}>
              {leadOutcomeLabel(outcome)}
            </span>
            {outcomeAt === null ? null : ` le ${formatDate(outcomeAt)}`}.
          </>
        )}
      </p>

      {outcome === "won" ? (
        <p className="text-xs text-text-tertiary">
          Issue finale : elle ne peut plus être modifiée depuis l’interface.
        </p>
      ) : null}

      {pending === null ? (
        actions.length === 0 ? null : (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => {
                  mutation.reset();
                  setPending(action);
                }}
                className="rounded-app-md border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              >
                Marquer {leadOutcomeLabel(action).toLowerCase()}
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3 rounded-app-md border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">{confirmations[pending].title}</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-900">
            {confirmations[pending].points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {mutation.isError ? (
            <p role="alert" className="text-sm font-medium text-red-700">
              {refusalMessage(mutation.error)}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(pending, { onSuccess: () => setPending(null) })}
              className="rounded-app-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Enregistrement…" : "Confirmer"}
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => setPending(null)}
              className="rounded-app-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
