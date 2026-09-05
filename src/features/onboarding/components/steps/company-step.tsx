"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import type { CompanyStepData } from "../../model/onboarding";
import { companyStepSchema } from "../../schemas/onboarding-schemas";
import { TextAreaField, TextField } from "../form-fields";
import { StepFormLayout } from "../step-form-layout";

interface CompanyStepProps {
  initialData: CompanyStepData;
  onComplete: (data: CompanyStepData) => void;
}

export function CompanyStep({ initialData, onComplete }: CompanyStepProps) {
  const { draft, errors, updateField, validate } = useStepForm(initialData, companyStepSchema);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout
      title="Commençons par l’entreprise"
      description="Donnez à Bewise suffisamment de contexte pour comprendre l’activité. Les détails pourront être enrichis progressivement."
      onSubmit={handleSubmit}
      onBack={null}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="company-name" label="Nom de l’entreprise" value={draft.companyName} onChange={(event) => updateField("companyName", event.target.value)} error={errors.companyName} />
        <TextField id="company-website" label="Site internet" type="url" value={draft.website} onChange={(event) => updateField("website", event.target.value)} error={errors.website} optional hint="Le backend pourra plus tard utiliser ce site pour proposer un enrichissement à valider." />
        <TextField id="company-industry" label="Secteur ou activité" value={draft.industry} onChange={(event) => updateField("industry", event.target.value)} error={errors.industry} placeholder="Ex. conseil en cybersécurité" />
        <TextField id="company-market" label="Pays ou zone principale" value={draft.primaryMarket} onChange={(event) => updateField("primaryMarket", event.target.value)} optional />
      </div>
      <TextAreaField id="company-description" label="Description courte" value={draft.description} onChange={(event) => updateField("description", event.target.value)} error={errors.description} placeholder="Que fait l’entreprise, pour qui, et dans quel contexte ?" />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="company-size" label="Taille de l’entreprise" value={draft.companySize} onChange={(event) => updateField("companySize", event.target.value)} optional placeholder="Ex. 20 à 50 personnes" />
        <TextField id="contact-name" label="Interlocuteur principal" value={draft.primaryContactName} onChange={(event) => updateField("primaryContactName", event.target.value)} error={errors.primaryContactName} />
        <TextField id="contact-email" label="E-mail de l’interlocuteur" type="email" value={draft.primaryContactEmail} onChange={(event) => updateField("primaryContactEmail", event.target.value)} error={errors.primaryContactEmail} optional />
      </div>
    </StepFormLayout>
  );
}
