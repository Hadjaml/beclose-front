"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import type { TargetSegmentData } from "../../model/onboarding";
import { targetSegmentSchema } from "../../schemas/onboarding-schemas";
import { TextAreaField, TextField } from "../form-fields";
import { StepFormLayout } from "../step-form-layout";

interface TargetStepProps {
  initialData: TargetSegmentData;
  onBack: (data: TargetSegmentData) => void;
  onComplete: (data: TargetSegmentData) => void;
}

export function TargetStep({ initialData, onBack, onComplete }: TargetStepProps) {
  const form = useStepForm(initialData, targetSegmentSchema);
  const { draft, errors, updateField } = form;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="À qui l’offre doit-elle s’adresser ?" description="Décrivez une première cible claire. Cette structure pourra accueillir plusieurs segments sans alourdir le parcours actuel." onSubmit={handleSubmit} onBack={() => onBack(draft)}>
      <TextField id="target-name" label="Nom de cette cible" value={draft.name} onChange={(event) => updateField("name", event.target.value)} optional />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextAreaField id="target-industries" label="Secteurs" value={draft.industries} onChange={(event) => updateField("industries", event.target.value)} error={errors.industries} />
        <TextAreaField id="target-geographies" label="Géographie" value={draft.geographies} onChange={(event) => updateField("geographies", event.target.value)} error={errors.geographies} />
        <TextField id="target-size" label="Taille d’entreprise" value={draft.companySizes} onChange={(event) => updateField("companySizes", event.target.value)} optional />
        <TextField id="target-types" label="Type d’entreprise" value={draft.companyTypes} onChange={(event) => updateField("companyTypes", event.target.value)} optional />
      </div>
      <TextAreaField id="target-roles" label="Fonctions et décideurs recherchés" value={draft.decisionMakers} onChange={(event) => updateField("decisionMakers", event.target.value)} error={errors.decisionMakers} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <TextAreaField id="target-required" label="Doit correspondre" value={draft.requiredCriteria} onChange={(event) => updateField("requiredCriteria", event.target.value)} error={errors.requiredCriteria} />
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
          <TextAreaField id="target-preferred" label="Idéalement" value={draft.preferredCriteria} onChange={(event) => updateField("preferredCriteria", event.target.value)} optional />
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
          <TextAreaField id="target-exclusions" label="À exclure" value={draft.exclusions} onChange={(event) => updateField("exclusions", event.target.value)} error={errors.exclusions} />
        </div>
      </div>
    </StepFormLayout>
  );
}
