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
      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-zinc-600">Progression</p><p className="mt-1 text-sm font-semibold text-zinc-950">{completedCount} sur {onboardingSteps.length} étapes</p></div>
          <span className="text-sm font-semibold tabular-nums text-zinc-700">{progress}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true"><div className="h-full rounded-full bg-zinc-950 transition-[width]" style={{ width: `${progress}%` }} /></div>
        <ol className="mt-5 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {onboardingSteps.map((step, index) => {
            const status = statuses[step.id];
            return (
              <li key={step.id}>
                <div aria-current={step.id === currentStep ? "step" : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${step.id === currentStep ? "bg-zinc-100 text-zinc-950 ring-1 ring-zinc-200" : status === "COMPLETED" ? "text-zinc-800" : "text-zinc-500"}`}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${step.id === currentStep ? "bg-zinc-950 text-white" : status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>{status === "COMPLETED" && step.id !== currentStep ? "✓" : index + 1}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold">{step.label}</span><span className="block text-sm text-zinc-600">{statusLabel[status]}</span></span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
