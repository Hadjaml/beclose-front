"use client";

import { useState, type FormEvent } from "react";
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
  const [additionalInformationOpen, setAdditionalInformationOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = validate();
    if (data !== null) {
      onComplete(data);
      return;
    }
    setAdditionalInformationOpen(true);
  }

  return (
    <StepFormLayout
      title="Commençons par l’entreprise"
      description="Donnez à Bewise suffisamment de contexte pour comprendre l’activité. Les détails pourront être enrichis progressivement."
      onSubmit={handleSubmit}
      onBack={null}
    >
      <section aria-labelledby="essential-company-information" className="space-y-6">
        <div>
          <h2 id="essential-company-information" className="text-base font-semibold text-text-primary">L’essentiel</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">Les informations nécessaires pour comprendre rapidement l’activité.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="company-name" label="Nom de l’entreprise" value={draft.companyName} onChange={(event) => updateField("companyName", event.target.value)} error={errors.companyName} />
        <TextField id="company-website" label="Site internet" type="url" value={draft.website} onChange={(event) => updateField("website", event.target.value)} error={errors.website} optional hint="Bewise pourra utiliser ce site pour préremplir certaines informations." />
        <TextField id="company-industry" label="Secteur ou activité" value={draft.industry} onChange={(event) => updateField("industry", event.target.value)} error={errors.industry} placeholder="Ex. conseil en cybersécurité" />
        </div>
        <TextAreaField id="company-description" label="Description courte" value={draft.description} onChange={(event) => updateField("description", event.target.value)} error={errors.description} placeholder="Que fait l’entreprise, pour qui, et dans quel contexte ?" />
      </section>
      <details
        open={additionalInformationOpen}
        onToggle={(event) => setAdditionalInformationOpen(event.currentTarget.open)}
        className="group rounded-app-lg border border-border bg-surface-muted/70"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-text-primary marker:hidden">
          <span>
            Informations complémentaires
            <span className="mt-1 block text-sm font-normal text-text-secondary">Contexte commercial et interlocuteur de référence</span>
          </span>
          <span className="text-lg text-text-tertiary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="grid gap-6 border-t border-border bg-surface px-5 py-5 sm:grid-cols-2">
          <TextField id="company-market" label="Pays ou zone principale" value={draft.primaryMarket} onChange={(event) => updateField("primaryMarket", event.target.value)} optional />
          <TextField id="company-size" label="Taille de l’entreprise" value={draft.companySize} onChange={(event) => updateField("companySize", event.target.value)} optional placeholder="Ex. 20 à 50 personnes" />
          <TextField id="contact-name" label="Interlocuteur principal" value={draft.primaryContactName} onChange={(event) => updateField("primaryContactName", event.target.value)} error={errors.primaryContactName} />
          <TextField id="contact-email" label="E-mail de l’interlocuteur" type="email" value={draft.primaryContactEmail} onChange={(event) => updateField("primaryContactEmail", event.target.value)} error={errors.primaryContactEmail} optional />
        </div>
      </details>
    </StepFormLayout>
  );
}
