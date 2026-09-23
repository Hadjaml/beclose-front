"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  bantCriteriaFormSchema,
  bantFieldHints,
  emptyBantCriteriaDraft,
  toBantCriteriaPayload,
  useCreateBantCriteriaVersionMutation,
} from "@/features/client-configuration";
import { MutationErrorBanner, StepFormLayout, TextField, useStepForm } from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { BantAuthoritySection } from "./bant-authority-section";
import { BantBudgetSection } from "./bant-budget-section";
import { BantConversationPolicySection } from "./bant-conversation-policy-section";
import { BantHandoffRulesSection } from "./bant-handoff-rules-section";
import { BantNeedSection } from "./bant-need-section";
import { BantNurtureRulesSection } from "./bant-nurture-rules-section";
import { BantQualificationRulesSection } from "./bant-qualification-rules-section";
import { BantTimingSection } from "./bant-timing-section";

interface BantStepProps {
  workspaceId: WorkspaceId;
  workspaceName: string;
  onCreated: () => void;
}

export function BantStep({ workspaceId, workspaceName, onCreated }: BantStepProps) {
  const [name, setName] = useState(`Grille BANT ${workspaceName}`);
  const form = useStepForm(emptyBantCriteriaDraft, bantCriteriaFormSchema);
  const { draft, updateField } = form;
  const mutation = useCreateBantCriteriaVersionMutation(workspaceId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const criteria = form.validate();
    if (criteria === null || name.trim() === "") return;

    mutation.mutate(
      {
        name,
        notes: null,
        criteria: toBantCriteriaPayload({ ...criteria, profileName: name }),
      },
      { onSuccess: onCreated },
    );
  }

  return (
    <StepFormLayout
      title="Créer la grille BANT"
      description="Si l'opportunité mérite d'être transmise. Dernière étape : cette version devient active dès sa création."
      onSubmit={handleSubmit}
      onBack={null}
      submitLabel={mutation.isPending ? "Création…" : "Créer"}
    >
      {mutation.isError ? <MutationErrorBanner error={mutation.error} /> : null}

      <TextField
        id="bant-name"
        label="Nom de cette version"
        value={name}
        onChange={(event) => setName(event.target.value)}
        hint={bantFieldHints.profileName}
      />

      <BantBudgetSection value={draft.budget} onChange={(next) => updateField("budget", next)} />
      <BantAuthoritySection value={draft.authority} onChange={(next) => updateField("authority", next)} />
      <BantNeedSection value={draft.need} onChange={(next) => updateField("need", next)} />
      <BantTimingSection value={draft.timing} onChange={(next) => updateField("timing", next)} />
      <BantQualificationRulesSection
        value={draft.qualificationRules}
        onChange={(next) => updateField("qualificationRules", next)}
      />
      <BantHandoffRulesSection value={draft.handoffRules} onChange={(next) => updateField("handoffRules", next)} />
      <BantNurtureRulesSection value={draft.nurtureRules} onChange={(next) => updateField("nurtureRules", next)} />
      <BantConversationPolicySection
        value={draft.conversationPolicy}
        onChange={(next) => updateField("conversationPolicy", next)}
      />
    </StepFormLayout>
  );
}
