"use client";

import type { FormEvent } from "react";
import { useStepForm } from "@/shared/ui/forms";
import type { OfferStepData } from "../../model/onboarding";
import { offerStepSchema } from "../../schemas/onboarding-schemas";
import { TextAreaField, TextField } from "@/shared/ui/forms";
import { StepFormLayout } from "@/shared/ui/forms";

interface OfferStepProps {
  initialData: OfferStepData;
  onBack: (data: OfferStepData) => void;
  onComplete: (data: OfferStepData) => void;
}

export function OfferStep({ initialData, onBack, onComplete }: OfferStepProps) {
  const form = useStepForm(initialData, offerStepSchema);
  const { draft, errors, updateField } = form;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="Que doit-on aider le client à vendre ?" description="Concentrez-vous sur une offre principale. Il sera possible d’en gérer plusieurs plus tard." onSubmit={handleSubmit} onBack={() => onBack(draft)}>
      <TextField id="offer-name" label="Nom de l’offre" value={draft.offerName} onChange={(event) => updateField("offerName", event.target.value)} error={errors.offerName} />
      <TextAreaField id="offer-description" label="Description" value={draft.description} onChange={(event) => updateField("description", event.target.value)} error={errors.description} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextAreaField id="offer-value" label="Proposition de valeur" value={draft.valueProposition} onChange={(event) => updateField("valueProposition", event.target.value)} error={errors.valueProposition} placeholder="Pourquoi cette offre mérite-t-elle l’attention ?" />
        <TextAreaField id="offer-problem" label="Problème résolu" value={draft.problemSolved} onChange={(event) => updateField("problemSolved", event.target.value)} error={errors.problemSolved} />
      </div>
      <TextAreaField id="offer-target" label="Cible de cette offre" value={draft.targetCustomer} onChange={(event) => updateField("targetCustomer", event.target.value)} error={errors.targetCustomer} />
      <details className="group rounded-app-lg border border-border bg-surface-muted/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-text-primary marker:hidden">
          <span>
            Informations commerciales complémentaires
            <span className="mt-1 block text-sm font-normal text-text-secondary">Prix, preuves et précisions utiles à la vente</span>
          </span>
          <span className="text-lg text-text-tertiary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="space-y-6 border-t border-border bg-surface px-5 py-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="offer-price" label="Prix ou fourchette" value={draft.priceRange} onChange={(event) => updateField("priceRange", event.target.value)} optional />
            <TextAreaField id="offer-evidence" label="Éléments de preuve" value={draft.evidence} onChange={(event) => updateField("evidence", event.target.value)} optional placeholder="Résultats, références, certifications…" />
          </div>
          <TextAreaField id="offer-notes" label="Informations commerciales importantes" value={draft.salesNotes} onChange={(event) => updateField("salesNotes", event.target.value)} optional />
        </div>
      </details>
    </StepFormLayout>
  );
}
