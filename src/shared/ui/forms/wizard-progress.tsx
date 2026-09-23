"use client";

/**
 * Generic step-progress sidebar for a multi-step form. Business-agnostic —
 * extracted from `features/onboarding` (2026-09-23) and generalized over
 * the step id type (was hardcoded to `OnboardingStepId`) so other
 * step-based flows (e.g. the upcoming ICP/BANT creation flow) can reuse it
 * with their own, shorter step list.
 */
export type WizardStepStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

export const wizardStepStatusLabels: Record<WizardStepStatus, string> = {
  NOT_STARTED: "À venir",
  IN_PROGRESS: "Étape en cours",
  COMPLETED: "Terminée",
  BLOCKED: "Bloqué",
};

export interface WizardStepDefinition<StepId extends string> {
  id: StepId;
  label: string;
}

export interface WizardProgressProps<StepId extends string> {
  ariaLabel: string;
  steps: readonly WizardStepDefinition<StepId>[];
  currentStep: StepId;
  statuses: Record<StepId, WizardStepStatus>;
}

export function WizardProgress<StepId extends string>({
  ariaLabel,
  steps,
  currentStep,
  statuses,
}: WizardProgressProps<StepId>) {
  const completedCount = steps.filter((step) => statuses[step.id] === "COMPLETED").length;
  const progress = steps.length === 0 ? 0 : Math.round((completedCount / steps.length) * 100);

  return (
    <aside aria-label={ariaLabel} className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-app-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-secondary">Progression</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {completedCount} sur {steps.length} étapes
            </p>
          </div>
          <span className="text-sm font-semibold tabular-nums text-text-secondary">{progress}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
          <div className="brand-gradient h-full rounded-full transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <ol className="mt-5 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {steps.map((step, index) => {
            const status = statuses[step.id];
            return (
              <li key={step.id}>
                <div
                  aria-current={step.id === currentStep ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-app-md px-3 py-2.5 text-left ${
                    step.id === currentStep
                      ? "bg-brand-soft text-brand-navy ring-1 ring-brand-blue-violet/15"
                      : status === "COMPLETED"
                        ? "text-text-primary"
                        : "text-text-tertiary"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      step.id === currentStep
                        ? "brand-gradient-action text-white"
                        : status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-surface-muted text-text-tertiary"
                    }`}
                  >
                    {status === "COMPLETED" && step.id !== currentStep ? "✓" : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{step.label}</span>
                    <span className="block text-sm text-text-secondary">{wizardStepStatusLabels[status]}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
