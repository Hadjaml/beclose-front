"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import type { ApproachStepData } from "../../model/onboarding";
import { approachStepSchema } from "../../schemas/onboarding-schemas";
import { TextAreaField, TextField } from "../form-fields";
import { StepFormLayout } from "../step-form-layout";

interface ApproachStepProps {
  initialData: ApproachStepData;
  onBack: (data: ApproachStepData) => void;
  onComplete: (data: ApproachStepData) => void;
}

export function ApproachStep({ initialData, onBack, onComplete }: ApproachStepProps) {
  const form = useStepForm(initialData, approachStepSchema);
  const { draft, errors, updateField } = form;
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="Comment le client souhaite-t-il communiquer ?" description="Décrivez une manière de parler reconnaissable, crédible et adaptée à ses prospects. Aucun vocabulaire technique n’est nécessaire." onSubmit={handleSubmit} onBack={() => onBack(draft)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="approach-tone" label="Ton" value={draft.tone} onChange={(event) => updateField("tone", event.target.value)} error={errors.tone} placeholder="Ex. direct, rassurant et concret" />
        <div className="space-y-2">
          <label htmlFor="approach-formality" className="text-sm font-semibold text-zinc-900">Niveau de formalité</label>
          <select id="approach-formality" value={draft.formality} onChange={(event) => updateField("formality", event.target.value as ApproachStepData["formality"])} className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10">
            <option value="" disabled>Choisir un niveau</option>
            <option value="casual">Simple et conversationnel</option>
            <option value="balanced">Professionnel et naturel</option>
            <option value="formal">Très formel</option>
          </select>
        </div>
      </div>
      <TextAreaField id="approach-positioning" label="Positionnement" value={draft.positioning} onChange={(event) => updateField("positioning", event.target.value)} error={errors.positioning} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextAreaField id="approach-arguments" label="Arguments clés" value={draft.keyArguments} onChange={(event) => updateField("keyArguments", event.target.value)} error={errors.keyArguments} />
        <TextAreaField id="approach-evidence" label="Preuves à utiliser" value={draft.evidence} onChange={(event) => updateField("evidence", event.target.value)} optional />
        <TextAreaField id="approach-objections" label="Objections connues" value={draft.knownObjections} onChange={(event) => updateField("knownObjections", event.target.value)} optional />
        <TextAreaField id="approach-answers" label="Réponses possibles" value={draft.possibleAnswers} onChange={(event) => updateField("possibleAnswers", event.target.value)} optional />
      </div>
      <TextAreaField id="approach-forbidden" label="Éléments à ne jamais dire" value={draft.forbiddenTopics} onChange={(event) => updateField("forbiddenTopics", event.target.value)} error={errors.forbiddenTopics} />
      <TextField id="approach-cta" label="Action à proposer" value={draft.preferredCta} onChange={(event) => updateField("preferredCta", event.target.value)} error={errors.preferredCta} placeholder="Ex. proposer un échange de 20 minutes" />
      <TextAreaField id="approach-examples" label="Exemples utiles" value={draft.examples} onChange={(event) => updateField("examples", event.target.value)} optional />
    </StepFormLayout>
  );
}
