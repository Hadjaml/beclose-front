"use client";

import { useState } from "react";
import { getApiErrorCode, getApiErrorMessage } from "@/shared/api/api-error-code";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useRequestDraftRegenerationMutation } from "../api/use-request-draft-regeneration-mutation";

interface DraftRegenerationState {
  available: boolean;
  requested: boolean;
  rejectedDrafts: number;
  remaining: number;
}

function refusalMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "DRAFT_REGENERATION_LIMIT_REACHED":
      return "La limite de reprises pour ce prospect est atteinte.";
    case "DRAFT_REGENERATION_NOT_ALLOWED":
      return getApiErrorMessage(error) ?? "Un nouveau brouillon ne peut pas être demandé dans l’état actuel du prospect.";
    default:
      return "Impossible de demander un nouveau brouillon. Réessayez dans quelques instants.";
  }
}

/**
 * After a rejected draft, the way forward: ask for a NEW one. Everything
 * comes from Beclose's `draftRegeneration` (available / requested / how many
 * are left) — nothing is inferred here, and without it (older backend) the
 * panel shows nothing. The rejected draft is kept in the history.
 */
export function DraftRegenerationPanel({
  workspaceId,
  leadId,
  draftRegeneration,
}: {
  workspaceId: WorkspaceId;
  leadId: string;
  draftRegeneration: DraftRegenerationState | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const mutation = useRequestDraftRegenerationMutation(workspaceId, leadId);

  if (draftRegeneration === null) return null;
  const { available, requested, rejectedDrafts, remaining } = draftRegeneration;

  if (requested) {
    return (
      <section className="rounded-app-lg border border-sky-200 bg-sky-50 p-5" role="status">
        <p className="text-sm font-semibold text-sky-950">Demande enregistrée</p>
        <p className="mt-1 text-sm text-sky-900">
          Le nouveau brouillon apparaîtra en attente de validation dans moins d’une minute.
        </p>
      </section>
    );
  }

  if (!available) {
    return rejectedDrafts > 0 && remaining === 0 ? (
      <section className="rounded-app-lg border border-border bg-surface p-5">
        <p className="text-sm text-text-secondary">
          Limite de reprises atteinte pour ce prospect : aucun nouveau brouillon ne peut être demandé.
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="space-y-3 rounded-app-lg border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">Brouillon rejeté</h2>
      {confirming ? (
        <div className="space-y-3 rounded-app-md border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-950">
            Demander un nouveau brouillon à la place du brouillon rejeté : il reste {remaining}{" "}
            {remaining > 1 ? "reprises" : "reprise"} pour ce prospect. Le brouillon rejeté est conservé
            dans l’historique.
          </p>
          {mutation.isError ? (
            <p role="alert" className="text-sm font-medium text-red-700">
              {refusalMessage(mutation.error)}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(undefined, { onSuccess: () => setConfirming(false) })}
              className="rounded-app-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Demande…" : "Confirmer"}
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => setConfirming(false)}
              className="rounded-app-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            Le dernier brouillon a été rejeté. Vous pouvez demander une nouvelle version.
          </p>
          <button
            type="button"
            onClick={() => {
              mutation.reset();
              setConfirming(true);
            }}
            className="rounded-app-md border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            Nouveau brouillon
          </button>
        </>
      )}
    </section>
  );
}
