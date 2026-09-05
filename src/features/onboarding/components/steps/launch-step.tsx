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
  { id: "training", label: "Entraînement prêt" },
];

export function LaunchStep({ statuses, completed, onBack, onComplete }: LaunchStepProps) {
  const ready = checklist.every((item) => statuses[item.id] === "COMPLETED");

  return (
    <section className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">Vérifier avant de préparer le lancement</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">Ce récapitulatif reflète uniquement les étapes réellement validées dans ce formulaire.</p>
      </header>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {checklist.map((item) => {
          const itemCompleted = statuses[item.id] === "COMPLETED";
          return (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm font-medium text-zinc-800">{item.label}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${itemCompleted ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>
                {itemCompleted ? "Terminé" : "À compléter"}
              </span>
            </li>
          );
        })}
      </ul>
      {completed ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5" role="status">
          <p className="font-semibold text-emerald-950">Configuration prête pour la prochaine étape</p>
          <p className="mt-1 text-sm text-emerald-800">Aucun système n’a été lancé. Le backend pourra plus tard prendre en charge la préparation effective.</p>
        </div>
      ) : null}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
        <button type="button" onClick={() => onBack({ readyForPreparation: false })} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Étape précédente</button>
        <button type="button" disabled={!ready || completed} onClick={() => onComplete({ readyForPreparation: true })} className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300">
          {completed ? "Préparation confirmée" : "Préparer le lancement"}
        </button>
      </footer>
    </section>
  );
}
