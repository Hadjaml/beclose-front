"use client";

import { useState, type FormEvent } from "react";
import {
  emptyIcpCriteriaDraft,
  icpCriteriaFormSchema,
  icpFieldHints,
  toIcpCriteriaPayload,
  useCreateIcpProfileVersionMutation,
} from "@/features/client-configuration";
import {
  MutationErrorBanner,
  StepFormLayout,
  TextAreaField,
  TextField,
  ValidationErrorBanner,
  useStepForm,
} from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { IcpCommercialMaturitySection } from "./icp-commercial-maturity-section";
import { IcpCompanyFitSection } from "./icp-company-fit-section";
import { IcpDecisionMakersSection } from "./icp-decision-makers-section";
import { IcpMarketSection } from "./icp-market-section";
import { IcpPrioritySectorsSection } from "./icp-priority-sectors-section";
import { IcpProspectabilitySection } from "./icp-prospectability-section";
import { IcpSignalsSection } from "./icp-signals-section";

interface IcpStepProps {
  workspaceId: WorkspaceId;
  workspaceName: string;
  onCreated: () => void;
}

export function IcpStep({ workspaceId, workspaceName, onCreated }: IcpStepProps) {
  const [name, setName] = useState(`Profil ICP ${workspaceName}`);
  const form = useStepForm(emptyIcpCriteriaDraft, icpCriteriaFormSchema);
  const { draft, updateField } = form;
  const mutation = useCreateIcpProfileVersionMutation(workspaceId);
  const [showValidationError, setShowValidationError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const criteria = form.validate();
    if (criteria === null || name.trim() === "") {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);

    mutation.mutate(
      {
        name,
        notes: null,
        criteria: toIcpCriteriaPayload({ ...criteria, profileName: name }),
      },
      { onSuccess: onCreated },
    );
  }

  return (
    <StepFormLayout
      title="Créer le profil ICP"
      description="Qui cibler. Cette version devient active dès sa création — indépendante de la grille BANT qui suit."
      onSubmit={handleSubmit}
      onBack={null}
      submitLabel={mutation.isPending ? "Création…" : "Créer et continuer"}
    >
      {showValidationError ? <ValidationErrorBanner /> : null}
      {mutation.isError ? <MutationErrorBanner error={mutation.error} /> : null}

      <TextField
        id="icp-name"
        label="Nom de cette version"
        value={name}
        onChange={(event) => setName(event.target.value)}
        hint={icpFieldHints.profileName}
      />
      <TextAreaField
        id="icp-purpose"
        label="Objet de ce profil"
        value={draft.purpose}
        onChange={(event) => updateField("purpose", event.target.value)}
        hint={icpFieldHints.purpose}
      />

      <IcpMarketSection value={draft.market} onChange={(next) => updateField("market", next)} />
      <IcpCompanyFitSection value={draft.companyFit} onChange={(next) => updateField("companyFit", next)} />
      <IcpPrioritySectorsSection
        value={draft.prioritySectors}
        onChange={(next) => updateField("prioritySectors", next)}
      />
      <IcpCommercialMaturitySection
        value={draft.commercialMaturity}
        onChange={(next) => updateField("commercialMaturity", next)}
      />
      <IcpProspectabilitySection
        value={draft.prospectability}
        onChange={(next) => updateField("prospectability", next)}
      />
      <IcpDecisionMakersSection
        value={draft.decisionMakers}
        onChange={(next) => updateField("decisionMakers", next)}
      />
      <IcpSignalsSection
        positiveSignals={draft.positiveSignals}
        negativeSignals={draft.negativeSignals}
        hardDisqualifiers={draft.hardDisqualifiers}
        onPositiveSignalsChange={(next) => updateField("positiveSignals", next)}
        onNegativeSignalsChange={(next) => updateField("negativeSignals", next)}
        onHardDisqualifiersChange={(next) => updateField("hardDisqualifiers", next)}
      />
    </StepFormLayout>
  );
}
