"use client";

import { useState } from "react";
import { googleConnectionHealth, useWorkspaceIntegrationStatusQuery } from "@/features/integrations";
import { useUpdateClientMutation } from "@/features/clients";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { MutationErrorBanner, StepFormLayout, TextField } from "@/shared/ui/forms";
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

  const health = googleConnectionHealth(query.data.google);

  if (health.kind === "healthy") {
    return (
      <div className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
        <p className="text-sm font-semibold text-emerald-950">Gmail connecté</p>
        <p className="mt-1 text-sm text-emerald-800">
          Les messages générés pour ce client pourront être envoyés une fois validés.
        </p>
      </div>
    );
  }

  // Not connected-and-verified, but no reconnection needed: an access token
  // renews itself, so only say where the connection stands.
  if (!health.needsReconnect) {
    return (
      <div className="rounded-app-lg border border-border bg-surface-muted p-4" role="status">
        <p className="text-sm font-semibold text-text-primary">{health.label}</p>
        <p className="mt-1 text-sm text-text-secondary">{health.description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-app-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">
        {health.kind === "reconnect_required" ? "Reconnexion nécessaire" : "Gmail non connecté"}
      </p>
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
 *
 * Editable via `PATCH /organizations/{id}` (point 18, 23/09/2026 — shipped
 * by Vega in direct response to this exact gap) — a value left blank, or
 * mistyped, at the organization step is no longer stuck forever.
 */
function TelegramStatus({
  workspaceId,
  telegramChatId,
  onSaved,
}: {
  workspaceId: WorkspaceId;
  telegramChatId: string | null;
  onSaved: ((next: string | null) => void) | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(telegramChatId ?? "");
  const mutation = useUpdateClientMutation(workspaceId);

  function startEditing() {
    setDraft(telegramChatId ?? "");
    setIsEditing(true);
  }

  function save() {
    const trimmed = draft.trim();
    mutation.mutate(
      { telegramChatId: trimmed === "" ? null : trimmed },
      {
        onSuccess: (client) => {
          onSaved?.(client.telegramChatId);
          setIsEditing(false);
        },
      },
    );
  }

  if (isEditing) {
    return (
      <div
        className="space-y-3 rounded-app-lg border border-border bg-surface p-4"
        onKeyDown={(event) => {
          // This edit block lives inside the step's own <form> (the
          // "Terminer" submit button) — Enter here must save this field,
          // never submit the whole step and finish the wizard mid-edit.
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          }
        }}
      >
        {mutation.isError ? <MutationErrorBanner error={mutation.error} /> : null}
        <TextField
          id="connections-telegram-chat-id"
          label="Identifiant du groupe Telegram"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          optional
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={save}
            className="brand-gradient-action brand-gradient-hover rounded-app-md px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => setIsEditing(false)}
            className="rounded-app-md border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  if (telegramChatId !== null && telegramChatId.trim() !== "") {
    return (
      <div className="space-y-2 rounded-app-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
        <p className="text-sm font-semibold text-emerald-950">Groupe Telegram renseigné</p>
        <p className="text-sm text-emerald-800">
          Identifiant enregistré : <code className="text-emerald-950">{telegramChatId}</code>. Le
          bot pourra y poster les messages à valider une fois ajouté au groupe.
        </p>
        <button
          type="button"
          onClick={startEditing}
          className="text-sm font-semibold text-emerald-900 underline underline-offset-2"
        >
          Corriger
        </button>
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
        Beclose, aucun script dédié comme pour Gmail.
      </p>
      <button
        type="button"
        onClick={startEditing}
        className="text-sm font-semibold text-amber-900 underline underline-offset-2"
      >
        Renseigner l&rsquo;identifiant
      </button>
    </div>
  );
}

interface ConnectionsStepProps {
  workspaceId: WorkspaceId;
  telegramChatId: string | null;
  /** Optional: the stored value comes back through the configuration query
   * (invalidated by the update), so most callers need not track it. */
  onTelegramChatIdChange?: (next: string | null) => void;
  onFinish: () => void;
}

export function ConnectionsStep({
  workspaceId,
  telegramChatId,
  onTelegramChatIdChange,
  onFinish,
}: ConnectionsStepProps) {
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
        <TelegramStatus
          workspaceId={workspaceId}
          telegramChatId={telegramChatId}
          onSaved={onTelegramChatIdChange}
        />
      </div>
    </StepFormLayout>
  );
}
