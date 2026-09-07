"use client";

import type { LaunchStepData, OnboardingStepId, OnboardingStepStatus } from "../../model/onboarding";

interface LaunchStepProps {
  statuses: Record<OnboardingStepId, OnboardingStepStatus>;
  completed: boolean;
  onBack: (data: LaunchStepData) => void;
  onComplete: (data: LaunchStepData) => void;
}

const checklist: readonly { id: Exclude<OnboardingStepId, "launch">; label: string }[] = [
  { id: "company", label: "Entreprise configurée" },
  { id: "offer", label: "Offre configurée" },
  { id: "target", label: "Cible définie" },
  { id: "qualification", label: "Qualification définie" },
  { id: "approach", label: "Approche configurée" },
  { id: "tools", label: "Outils préparés" },
  { id: "training", label: "Apprentissage prêt" },
];

export function LaunchStep({ statuses, completed, onBack, onComplete }: LaunchStepProps) {
  const ready = checklist.every((item) => statuses[item.id] === "COMPLETED");

  return (
    <section className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">Validation finale</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">Ce récapitulatif reflète uniquement les étapes réellement validées dans ce formulaire.</p>
      </header>
      <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
        {checklist.map((item) => {
          const itemCompleted = statuses[item.id] === "COMPLETED";
          return (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
              <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${itemCompleted ? "bg-emerald-100 text-emerald-800" : "bg-surface-muted text-text-secondary"}`}>
                {itemCompleted ? "Terminé" : "À compléter"}
              </span>
            </li>
          );
        })}
      </ul>
      {completed ? (
        <div className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-5" role="status">
          <p className="font-semibold text-emerald-950">Préparation terminée</p>
          <p className="mt-1 text-sm text-emerald-800">La configuration est prête pour la prochaine étape.</p>
        </div>
      ) : null}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button type="button" onClick={() => onBack({ readyForPreparation: false })} className="rounded-app-md px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary">Étape précédente</button>
        <button type="button" disabled={!ready || completed} onClick={() => onComplete({ readyForPreparation: true })} className="rounded-app-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-hover disabled:cursor-not-allowed disabled:bg-border-strong">
          {completed ? "Prêt" : "Finaliser la préparation"}
        </button>
      </footer>
    </section>
  );
}
