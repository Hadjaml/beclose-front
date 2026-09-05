"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import type { QualificationStepData } from "../../model/onboarding";
import { qualificationStepSchema } from "../../schemas/onboarding-schemas";
import { TextAreaField } from "../form-fields";
import { StepFormLayout } from "../step-form-layout";

interface QualificationStepProps {
  initialData: QualificationStepData;
  onBack: (data: QualificationStepData) => void;
  onComplete: (data: QualificationStepData) => void;
}

export function QualificationStep({ initialData, onBack, onComplete }: QualificationStepProps) {
  const form = useStepForm(initialData, qualificationStepSchema);
  const { draft, errors, updateField } = form;
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="Qu’est-ce qu’une opportunité intéressante ?" description="Budget, décision, besoin et calendrier peuvent aider, mais ils ne sont pas obligatoires. Commencez par ce qui compte réellement pour ce client." onSubmit={handleSubmit} onBack={() => onBack(draft)}>
      <TextAreaField id="qualification-determining" label="Critères réellement déterminants" value={draft.determiningCriteria} onChange={(event) => updateField("determiningCriteria", event.target.value)} error={errors.determiningCriteria} hint="Ajoutez ici les critères propres à l’activité du client." />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextAreaField id="qualification-positive" label="Signaux positifs" value={draft.positiveSignals} onChange={(event) => updateField("positiveSignals", event.target.value)} error={errors.positiveSignals} />
        <TextAreaField id="qualification-exclusion" label="Signaux d’exclusion" value={draft.exclusionSignals} onChange={(event) => updateField("exclusionSignals", event.target.value)} error={errors.exclusionSignals} />
      </div>
      <details className="group rounded-xl border border-zinc-200 bg-zinc-50/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-zinc-800 marker:hidden">
          <span>
            Informations complémentaires
            <span className="mt-1 block text-sm font-normal text-zinc-600">Budget, décision, besoin et calendrier, si ces éléments sont utiles</span>
          </span>
          <span className="text-lg text-zinc-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="grid gap-6 border-t border-zinc-200 bg-white px-5 py-5 sm:grid-cols-2">
          <TextAreaField id="qualification-budget" label="Budget" value={draft.budget} onChange={(event) => updateField("budget", event.target.value)} optional rows={3} />
          <TextAreaField id="qualification-authority" label="Pouvoir de décision" value={draft.authority} onChange={(event) => updateField("authority", event.target.value)} optional rows={3} />
          <TextAreaField id="qualification-need" label="Besoin" value={draft.need} onChange={(event) => updateField("need", event.target.value)} optional rows={3} />
          <TextAreaField id="qualification-timing" label="Calendrier" value={draft.timing} onChange={(event) => updateField("timing", event.target.value)} optional rows={3} />
        </div>
      </details>
    </StepFormLayout>
  );
}
