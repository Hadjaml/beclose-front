"use client";

import Link from "next/link";
import { useState } from "react";
import { getApiErrorCode } from "@/shared/api/api-error-code";
import type { ArchiveResult } from "../api/clients-api";
import { useArchiveClientMutation } from "../api/use-archive-client-mutation";
import type { ClientSummary } from "../schemas/client-summary-schema";
import { ClientSetupStatus } from "./client-setup-status";

function archiveErrorMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "ORGANIZATION_ALREADY_ARCHIVED":
      return "Ce client est déjà archivé.";
    case "SOURCING_RUN_IN_PROGRESS":
      return "Un sourcing est en cours pour ce client (environ 30 minutes) — attendez sa fin, puis réessayez.";
    default:
      return "Impossible d’archiver ce client. Réessayez dans quelques instants.";
  }
}

function ArchiveConfirmation({
  client,
  onDone,
  onCancel,
}: {
  client: ClientSummary;
  onDone: (result: ArchiveResult) => void;
  onCancel: () => void;
}) {
  const mutation = useArchiveClientMutation();

  return (
    <div className="space-y-3 border-t border-border bg-amber-50 px-5 py-4">
      <p className="text-sm font-semibold text-amber-950">Archiver « {client.name} » ?</p>
      <ul className="list-inside list-disc space-y-1 text-sm text-amber-900">
        <li>
          <span className="font-medium">Gmail</span> : l’accès sera révoqué chez Google puis la
          connexion supprimée.
        </li>
        <li>
          <span className="font-medium">Telegram</span> : le bot quittera le groupe du client et
          l’identifiant sera effacé.
        </li>
        <li>
          Le client ne sera plus traité (sourcing, relances, envois) et disparaîtra de la liste.
        </li>
        <li>
          L’historique, y compris les désinscriptions, est conservé ; le nom reste réservé. Il
          n’existe pas encore de moyen de le réactiver depuis cette interface.
        </li>
      </ul>
      {mutation.isError ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {archiveErrorMessage(mutation.error)}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(client.workspaceId, { onSuccess: onDone })}
          className="rounded-app-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Archivage…" : "Confirmer l’archivage"}
        </button>
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={onCancel}
          className="rounded-app-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/**
 * One line of the clients list. The archive action is only offered when the
 * composition layer supplies `onArchived` AND the client is still active
 * (`archivedAt === null`) — per `AGENTS.md`, a mutation action is rendered
 * only when a real callback exists.
 */
export function ClientRow({
  client,
  onArchived,
}: {
  client: ClientSummary;
  onArchived?: (result: ArchiveResult) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const isArchived = client.archivedAt !== null;

  return (
    <li>
      <div className="flex items-center gap-2">
        <Link
          href={`/backoffice/workspaces/${client.workspaceId}`}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 px-5 py-4 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              {client.name}
              {isArchived ? (
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
                  Archivé
                </span>
              ) : null}
            </p>
            {client.pitch === null ? null : (
              <p className="mt-1 truncate text-sm text-text-secondary">{client.pitch}</p>
            )}
          </div>
          <span className="shrink-0 text-xs text-text-tertiary">
            {client.telegramChatId === null ? "Telegram non configuré" : "Telegram configuré"}
          </span>
        </Link>
        {onArchived === undefined || isArchived ? null : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mr-4 shrink-0 rounded-app-md border border-border px-3 py-1.5 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            Archiver
          </button>
        )}
      </div>
      {isArchived ? null : (
        <div className="px-5 pb-3">
          <ClientSetupStatus workspaceId={client.workspaceId} />
        </div>
      )}
      {confirming && onArchived !== undefined ? (
        <ArchiveConfirmation
          client={client}
          onCancel={() => setConfirming(false)}
          onDone={(result) => {
            setConfirming(false);
            onArchived(result);
          }}
        />
      ) : null}
    </li>
  );
}
