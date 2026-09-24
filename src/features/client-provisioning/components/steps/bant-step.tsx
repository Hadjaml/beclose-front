"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  type BantCriteriaWire,
  bantCriteriaFormSchema,
  bantDraftFromActive,
  bantFieldHints,
  emptyBantCriteriaDraft,
  toBantCriteriaPayload,
  useCreateBantCriteriaVersionMutation,
} from "@/features/client-configuration";
import {
  MutationErrorBanner,
  StepFormLayout,
  TextField,
  ValidationErrorBanner,
  useStepForm,
} from "@/shared/ui/forms";
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
  /** The active version, when a new one is being prepared from it: the form
   * starts from its values (still a NEW version, never an edit in place). */
  activeVersion?: { version: number; name: string; criteria: BantCriteriaWire };
  onCreated: () => void;
}

export function BantStep({ workspaceId, workspaceName, activeVersion, onCreated }: BantStepProps) {
  const form = useStepForm(
    activeVersion === undefined
      ? { ...emptyBantCriteriaDraft, profileName: `Grille BANT ${workspaceName}` }
      : bantDraftFromActive(activeVersion),
    bantCriteriaFormSchema,
  );
  const { draft, errors, updateField } = form;
  const mutation = useCreateBantCriteriaVersionMutation(workspaceId);
  // Stays busy after success too: the step only goes away once the
  // configuration is refetched, and a second click in between would create
  // one more version of the same policy.
  const isBusy = mutation.isPending || mutation.isSuccess;
  const [showValidationError, setShowValidationError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    const criteria = form.validate();
    if (criteria === null) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);

    mutation.mutate(
      {
        name: criteria.profileName,
        notes: null,
        criteria: toBantCriteriaPayload(criteria),
      },
      { onSuccess: onCreated },
    );
  }

  return (
    <StepFormLayout
      title="Créer la grille BANT"
      description={
        activeVersion === undefined
          ? "Si l'opportunité mérite d'être transmise. Dernière étape : cette version devient active dès sa création."
          : `Formulaire prérempli avec la version ${activeVersion.version} active. Enregistrer crée la version ${activeVersion.version + 1} et la rend active ; la version actuelle est conservée, rien n’est modifié en place.`
      }
      onSubmit={handleSubmit}
      onBack={null}
      submitLabel={isBusy ? "Création…" : "Créer"}
      isSubmitting={isBusy}
    >
      {showValidationError ? <ValidationErrorBanner errors={errors} /> : null}
      {mutation.isError ? <MutationErrorBanner error={mutation.error} /> : null}

      <TextField
        id="bant-name"
        label="Nom de cette version"
        value={draft.profileName}
        onChange={(event) => updateField("profileName", event.target.value)}
        error={errors["profileName"]}
        hint={bantFieldHints.profileName}
      />

      <BantBudgetSection value={draft.budget} onChange={(next) => updateField("budget", next)} errors={errors} />
      <BantAuthoritySection
        value={draft.authority}
        onChange={(next) => updateField("authority", next)}
        errors={errors}
      />
      <BantNeedSection value={draft.need} onChange={(next) => updateField("need", next)} errors={errors} />
      <BantTimingSection value={draft.timing} onChange={(next) => updateField("timing", next)} errors={errors} />
      <BantQualificationRulesSection
        value={draft.qualificationRules}
        onChange={(next) => updateField("qualificationRules", next)}
        errors={errors}
      />
      <BantHandoffRulesSection value={draft.handoffRules} onChange={(next) => updateField("handoffRules", next)} />
      <BantNurtureRulesSection
        value={draft.nurtureRules}
        onChange={(next) => updateField("nurtureRules", next)}
        errors={errors}
      />
      <BantConversationPolicySection
        value={draft.conversationPolicy}
        onChange={(next) => updateField("conversationPolicy", next)}
      />
    </StepFormLayout>
  );
}
