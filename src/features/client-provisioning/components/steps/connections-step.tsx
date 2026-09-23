"use client";

import { useState } from "react";
import { useWorkspaceIntegrationStatusQuery } from "@/features/integrations";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { StepFormLayout } from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * Last step of client provisioning (2026-09-23, renamed from
 * "Connexion Gmail" to "Connexions" the same day: Rochinel found the exact
 * same visibility gap on the client's Telegram group — `telegramChatId` is
 * just a blind text field on the organization step today, no status, no
 * reminder of the procedure). No real OAuth/bot setup flow in the browser
 * for either — this only makes both steps visible and non-forgettable.
 */

function GmailStatus({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceIntegrationStatusQuery(workspaceId);
  const [copied, setCopied] = useState(false);
  const command = `uv run python -m workers.connect_gmail_cli ${workspaceId}`;

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

  if (query.isPending) return <LoadingState label="Vérification de la connexion Gmail…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de vérifier la connexion Gmail" onRetry={() => void query.refetch()} />
    );
  }

  if (query.data.google?.connected === true) {
    return (
      <div className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
        <p className="text-sm font-semibold text-emerald-950">Gmail connecté</p>
        <p className="mt-1 text-sm text-emerald-800">
          Les messages générés pour ce client pourront être envoyés une fois validés.
        </p>
      </div>
    );
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

/**
 * `telegramChatId` is the CLIENT's own Telegram group (`organizations.
 * telegram_chat_id`) — where the bot posts messages for validation before
 * they go out. Distinct from `BEWISE_INTERNAL_ALERT_CHAT_ID` (a single,
 * global, Bewise-internal alert group already configured once in Beclose's
 * `.env`, out of scope for a per-client flow — never confuse the two.
 *
 * Unlike Gmail, there is no packaged CLI/script to retrieve a chat_id
 * today — only a manual procedure used once for the internal group
 * (`telegram_client.call("getUpdates")` after sending `/start` in the
 * group, per Beclose's own notes). Flagged to Orion/Vega as a candidate
 * for a small dedicated script; this step states the procedure in plain
 * language rather than inventing a command that doesn't exist.
 */
function TelegramStatus({ telegramChatId }: { telegramChatId: string | null }) {
  if (telegramChatId !== null && telegramChatId.trim() !== "") {
    return (
      <div className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
        <p className="text-sm font-semibold text-emerald-950">Groupe Telegram renseigné</p>
        <p className="mt-1 text-sm text-emerald-800">
          Identifiant enregistré : <code className="text-emerald-950">{telegramChatId}</code>. Le
          bot pourra y poster les messages à valider une fois ajouté au groupe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-app-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Groupe Telegram non renseigné</p>
      <p className="text-sm text-amber-800">
        Sans lui, les messages restent en attente de validation mais ne sont notifiés nulle part.
        Ajoutez le bot Bewise au groupe Telegram de ce client, envoyez-y la commande{" "}
        <code className="rounded bg-surface px-1 py-0.5">/start</code>, puis récupérez
        l&rsquo;identifiant du groupe (chat_id) — procédure aujourd&rsquo;hui manuelle côté
        Beclose, aucun script dédié comme pour Gmail. Une fois obtenu, transmettez-le pour qu&rsquo;il
        soit enregistré (pas encore de moyen de le modifier depuis cette interface après la
        création de l&rsquo;organisation).
      </p>
    </div>
  );
}

interface ConnectionsStepProps {
  workspaceId: WorkspaceId;
  telegramChatId: string | null;
  onFinish: () => void;
}

export function ConnectionsStep({ workspaceId, telegramChatId, onFinish }: ConnectionsStepProps) {
  return (
    <StepFormLayout
      title="Connexions"
      description="Dernière étape : Gmail et le groupe Telegram du client se configurent en dehors de cette interface, mais ne doivent pas se perdre en route."
      onSubmit={(event) => {
        event.preventDefault();
        onFinish();
      }}
      onBack={null}
      submitLabel="Terminer"
    >
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-text-primary">Gmail</h2>
        <GmailStatus workspaceId={workspaceId} />
      </div>
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-text-primary">Groupe Telegram du client</h2>
        <TelegramStatus telegramChatId={telegramChatId} />
      </div>
    </StepFormLayout>
  );
}
