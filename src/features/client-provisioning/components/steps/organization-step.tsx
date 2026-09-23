"use client";

import { useState, type FormEvent } from "react";
import {
  emptyOrganizationCreateDraft,
  organizationCreateSchema,
  organizationFieldHints,
  useCreateClientMutation,
} from "@/features/clients";
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
    >
      {showValidationError ? <ValidationErrorBanner errors={errors} /> : null}
      {mutation.isError ? <MutationErrorBanner error={mutation.error} /> : null}
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
