"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  emptyOrganizationCreateDraft,
  organizationCreateSchema,
  organizationFieldHints,
  useCreateClientMutation,
} from "@/features/clients";
import { getApiErrorCode, getApiErrorMessage } from "@/shared/api/api-error-code";
import {
  MutationErrorBanner,
  StepFormLayout,
  TextAreaField,
  TextField,
  ValidationErrorBanner,
  useStepForm,
} from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";

interface OrganizationStepProps {
  onCreated: (workspaceId: WorkspaceId, name: string, telegramChatId: string | null) => void;
}

export function OrganizationStep({ onCreated }: OrganizationStepProps) {
  const form = useStepForm(emptyOrganizationCreateDraft, organizationCreateSchema);
  const { draft, errors, updateField } = form;
  const mutation = useCreateClientMutation();
  const [showValidationError, setShowValidationError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    const data = form.validate();
    if (data === null) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    mutation.mutate(data, {
      onSuccess: (client) => onCreated(client.workspaceId, client.name, client.telegramChatId),
    });
  }

  return (
    <StepFormLayout
      title="Créer une organisation"
      description="Première étape, indépendante des deux suivantes : elle crée le client dans Beclose dès validation."
      onSubmit={handleSubmit}
      onBack={null}
      submitLabel={mutation.isPending ? "Création…" : "Créer et continuer"}
      isSubmitting={mutation.isPending}
    >
      {showValidationError ? <ValidationErrorBanner errors={errors} /> : null}
      {mutation.isError ? <CreateErrorBanner error={mutation.error} /> : null}
      <TextField
        id="organization-name"
        label="Nom"
        value={draft.name}
        onChange={(event) => updateField("name", event.target.value)}
        error={errors.name}
        hint={organizationFieldHints.name}
      />
      <TextAreaField
        id="organization-pitch"
        label="Pitch"
        value={draft.pitch ?? ""}
        onChange={(event) => updateField("pitch", event.target.value.trim() === "" ? null : event.target.value)}
        hint={organizationFieldHints.pitch}
        optional
      />
      <TextField
        id="organization-signature"
        label="Signature"
        value={draft.signature ?? ""}
        onChange={(event) =>
          updateField("signature", event.target.value.trim() === "" ? null : event.target.value)
        }
        hint={organizationFieldHints.signature}
        optional
      />
      <TextField
        id="organization-telegram-chat-id"
        label="Identifiant du groupe Telegram"
        value={draft.telegramChatId ?? ""}
        onChange={(event) =>
          updateField("telegramChatId", event.target.value.trim() === "" ? null : event.target.value)
        }
        hint={organizationFieldHints.telegramChatId}
        optional
      />
    </StepFormLayout>
  );
}

/** A taken name is the one failure the user can act on here: the client may
 * already exist (a previous attempt, an interrupted onboarding), and it is
 * resumed from the clients list — not by creating it again. */
function CreateErrorBanner({ error }: { error: unknown }) {
  if (getApiErrorCode(error) !== "ORGANIZATION_NAME_TAKEN") {
    return <MutationErrorBanner error={error} />;
  }
  return (
    <MutationErrorBanner
      error={error}
      title="Ce nom est déjà utilisé"
      description={`${getApiErrorMessage(error) ?? "Une organisation porte déjà ce nom."} Si ce client existe déjà, ne le recréez pas : retrouvez-le dans la liste des clients (« Reprendre » s’il n’est pas configuré jusqu’au bout ; les clients archivés s’y affichent via « Afficher les archivées »), ou choisissez un autre nom.`}
      action={
        <Link href="/backoffice/clients" className="text-sm font-semibold text-red-900 underline">
          Voir la liste des clients
        </Link>
      }
    />
  );
}
