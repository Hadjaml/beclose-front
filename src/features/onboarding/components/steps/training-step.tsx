"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import type { TrainingStepData } from "../../model/onboarding";
import { trainingStepSchema } from "../../schemas/onboarding-schemas";
import { StepFormLayout } from "../step-form-layout";

interface TrainingStepProps {
  initialData: TrainingStepData;
  onBack: (data: TrainingStepData) => void;
  onComplete: (data: TrainingStepData) => void;
}

const learningAreas = ["Ciblage", "Scoring", "Stratégies d’approche", "Messages", "Qualification"];
const learningFlow = ["Le système recommande", "L’humain valide", "Le système apprend", "Son autonomie augmente"];

export function TrainingStep({ initialData, onBack, onComplete }: TrainingStepProps) {
  const form = useStepForm(initialData, trainingStepSchema);
  const { draft, errors, updateField } = form;
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="Préparer l’apprentissage progressif" description="Bewise gagnera en autonomie à mesure que les recommandations seront validées ou corrigées par des humains." onSubmit={handleSubmit} onBack={() => onBack(draft)} submitLabel="Voir le récapitulatif">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {learningFlow.map((item, index) => (
          <li key={item} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <span className="text-xs font-semibold text-zinc-400">0{index + 1}</span>
            <p className="mt-2 text-sm font-semibold leading-5 text-zinc-900">{item}</p>
          </li>
        ))}
      </ol>
      <section>
        <h2 className="text-sm font-semibold text-zinc-900">Les validations concerneront progressivement</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {learningAreas.map((area) => <li key={area} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">{area}</li>)}
        </ul>
      </section>
      <label className="flex cursor-pointer gap-3 rounded-xl border border-zinc-200 p-4">
        <input type="checkbox" checked={draft.principleAcknowledged} onChange={(event) => updateField("principleAcknowledged", event.target.checked)} className="mt-1 size-4" />
        <span className="text-sm leading-6 text-zinc-700">J’ai compris que l’autonomie augmentera progressivement à partir des validations humaines.</span>
      </label>
      {errors.principleAcknowledged === undefined ? null : <p className="text-sm text-red-700" role="alert">{errors.principleAcknowledged}</p>}
    </StepFormLayout>
  );
}
