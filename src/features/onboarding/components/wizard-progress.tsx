"use client";

import { onboardingSteps, type OnboardingStepId, type OnboardingStepStatus } from "../model/onboarding";

interface WizardProgressProps {
  currentStep: OnboardingStepId;
  statuses: Record<OnboardingStepId, OnboardingStepStatus>;
}

const statusLabel: Record<OnboardingStepStatus, string> = {
  NOT_STARTED: "À venir",
  IN_PROGRESS: "Étape en cours",
  COMPLETED: "Terminée",
  BLOCKED: "Bloqué",
};

export function WizardProgress({ currentStep, statuses }: WizardProgressProps) {
  const completedCount = onboardingSteps.filter((step) => statuses[step.id] === "COMPLETED").length;
  const progress = Math.round((completedCount / onboardingSteps.length) * 100);

  return (
    <aside aria-label="Progression de l’onboarding" className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-app-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-text-secondary">Progression</p><p className="mt-1 text-sm font-semibold text-text-primary">{completedCount} sur {onboardingSteps.length} étapes</p></div>
          <span className="text-sm font-semibold tabular-nums text-text-secondary">{progress}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true"><div className="brand-gradient h-full rounded-full transition-[width]" style={{ width: `${progress}%` }} /></div>
        <ol className="mt-5 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {onboardingSteps.map((step, index) => {
            const status = statuses[step.id];
            return (
              <li key={step.id}>
                <div aria-current={step.id === currentStep ? "step" : undefined} className={`flex w-full items-center gap-3 rounded-app-md px-3 py-2.5 text-left ${step.id === currentStep ? "bg-brand-soft text-brand-navy ring-1 ring-brand-blue-violet/15" : status === "COMPLETED" ? "text-text-primary" : "text-text-tertiary"}`}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${step.id === currentStep ? "brand-gradient-action text-white" : status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-surface-muted text-text-tertiary"}`}>{status === "COMPLETED" && step.id !== currentStep ? "✓" : index + 1}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold">{step.label}</span><span className="block text-sm text-text-secondary">{statusLabel[status]}</span></span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
