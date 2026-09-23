"use client";

import { useState } from "react";
import { useWorkspaceIntegrationStatusQuery } from "@/features/integrations";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { StepFormLayout } from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * Last step of client provisioning (2026-09-23, real gap Rochinel hit: the
 * Gmail connection stayed CLI-only — `workers/connect_gmail_cli.py` — and
 * invisible in the interface, easy to forget after the organization/ICP/
 * BANT steps). No real OAuth flow in the browser here (bigger, separate
 * chantier per Orion) — this only makes the step visible and
 * non-forgettable: shows the real connection status (reusing the same
 * `GET /organizations/{id}/integrations` the Intégrations tab already
 * uses) and, if not connected, the exact CLI command with this
 * organization's real id already filled in.
 */
function GmailCliCommand({ workspaceId }: { workspaceId: WorkspaceId }) {
  const command = `uv run python -m workers.connect_gmail_cli ${workspaceId}`;
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // command is still fully visible and selectable, nothing is lost.
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3 rounded-app-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Gmail non connecté</p>
      <p className="text-sm text-amber-800">
        Sans cette connexion, les messages restent en attente de validation mais ne partent
        jamais. À lancer une fois, depuis un poste où Beclose est installé :
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="rounded-app-md bg-surface px-3 py-2 text-sm text-text-primary">
          {command}
        </code>
        <button
          type="button"
          onClick={() => void copyCommand()}
          className="rounded-app-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
        >
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
    </div>
  );
}

interface GmailConnectionStepProps {
  workspaceId: WorkspaceId;
  onFinish: () => void;
}

export function GmailConnectionStep({ workspaceId, onFinish }: GmailConnectionStepProps) {
  const query = useWorkspaceIntegrationStatusQuery(workspaceId);

  return (
    <StepFormLayout
      title="Connexion Gmail"
      description="Dernière étape : la connexion Gmail se fait en dehors du navigateur, mais elle ne doit pas se perdre en route."
      onSubmit={(event) => {
        event.preventDefault();
        onFinish();
      }}
      onBack={null}
      submitLabel="Terminer"
    >
      {query.isPending ? <LoadingState label="Vérification de la connexion Gmail…" /> : null}
      {query.isError ? (
        <ErrorState title="Impossible de vérifier la connexion Gmail" onRetry={() => void query.refetch()} />
      ) : null}
      {query.isSuccess ? (
        query.data.google?.connected === true ? (
          <div className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
            <p className="text-sm font-semibold text-emerald-950">Gmail connecté</p>
            <p className="mt-1 text-sm text-emerald-800">
              Les messages générés pour ce client pourront être envoyés une fois validés.
            </p>
          </div>
        ) : (
          <GmailCliCommand workspaceId={workspaceId} />
        )
      ) : null}
    </StepFormLayout>
  );
}
