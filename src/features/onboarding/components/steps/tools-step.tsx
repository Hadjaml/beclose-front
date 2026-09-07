"use client";

import type { FormEvent } from "react";
import { useStepForm } from "../../hooks/use-step-form";
import { integrationCategories, integrationStatusLabels } from "../../model/integration";
import type { ToolsStepData } from "../../model/onboarding";
import { toolsStepSchema } from "../../schemas/onboarding-schemas";
import { StepFormLayout } from "../step-form-layout";

interface ToolsStepProps {
  initialData: ToolsStepData;
  onBack: (data: ToolsStepData) => void;
  onComplete: (data: ToolsStepData) => void;
}

export function ToolsStep({ initialData, onBack, onComplete }: ToolsStepProps) {
  const form = useStepForm(initialData, toolsStepSchema);
  const { draft, errors, updateField } = form;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = form.validate();
    if (data !== null) onComplete(data);
  }

  return (
    <StepFormLayout title="Où le client travaillera-t-il ?" description="Choisissez l’expérience principale. Les connexions seront préparées ensuite avec les outils sélectionnés." onSubmit={handleSubmit} onBack={() => onBack(draft)}>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-text-primary">Mode de travail</legend>
        <label className={`flex cursor-pointer gap-4 rounded-app-lg border p-4 transition ${draft.operatingMode === "client_tools" ? "border-brand-blue-violet bg-surface-muted ring-1 ring-brand-blue-violet" : "border-border bg-surface"}`}>
          <input type="radio" name="operating-mode" value="client_tools" checked={draft.operatingMode === "client_tools"} onChange={() => updateField("operatingMode", "client_tools")} className="mt-1" />
          <span><span className="block text-sm font-semibold text-text-primary">Le client travaillera depuis ses propres outils</span><span className="mt-1 block text-sm text-text-secondary">Bewise s’intégrera à son environnement habituel.</span></span>
        </label>
        <label className={`flex cursor-pointer gap-4 rounded-app-lg border p-4 transition ${draft.operatingMode === "bewise_portal" ? "border-brand-blue-violet bg-surface-muted ring-1 ring-brand-blue-violet" : "border-border bg-surface"}`}>
          <input type="radio" name="operating-mode" value="bewise_portal" checked={draft.operatingMode === "bewise_portal"} onChange={() => updateField("operatingMode", "bewise_portal")} className="mt-1" />
          <span><span className="block text-sm font-semibold text-text-primary">Le client utilisera le portail Bewise</span><span className="mt-1 block text-sm text-text-secondary">Les validations et interventions seront regroupées dans une interface simplifiée.</span></span>
        </label>
        {errors.operatingMode === undefined ? null : <p className="text-sm text-red-700" role="alert">{errors.operatingMode}</p>}
      </fieldset>
      <section aria-labelledby="integration-categories">
        <h2 id="integration-categories" className="text-sm font-semibold text-text-primary">Connexions à préparer</h2>
        <p className="mt-1 text-sm text-text-secondary">Les outils seront connectés dans une prochaine étape.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrationCategories.map((category) => (
            <div key={category} className="rounded-app-lg border border-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-text-primary">{category}</p>
              <p className="mt-2 text-sm text-text-secondary">{integrationStatusLabels.not_connected}</p>
            </div>
          ))}
        </div>
      </section>
    </StepFormLayout>
  );
}
