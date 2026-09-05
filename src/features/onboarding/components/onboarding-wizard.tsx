"use client";

import Link from "next/link";
import { useState } from "react";
import { emptyOnboardingDraft, initialOnboardingStatuses } from "../model/initial-onboarding";
import {
  onboardingStepIds,
  type OnboardingDraft,
  type OnboardingStepId,
  type OnboardingWizardSnapshot,
} from "../model/onboarding";
import { ApproachStep } from "./steps/approach-step";
import { CompanyStep } from "./steps/company-step";
import { LaunchStep } from "./steps/launch-step";
import { OfferStep } from "./steps/offer-step";
import { QualificationStep } from "./steps/qualification-step";
import { TargetStep } from "./steps/target-step";
import { ToolsStep } from "./steps/tools-step";
import { TrainingStep } from "./steps/training-step";
import { WizardProgress } from "./wizard-progress";

interface OnboardingWizardProps {
  initialSnapshot?: OnboardingWizardSnapshot;
}

export function OnboardingWizard({ initialSnapshot }: OnboardingWizardProps) {
  const [snapshot, setSnapshot] = useState<OnboardingWizardSnapshot>(() =>
    initialSnapshot ?? {
      currentStep: "company",
      draft: emptyOnboardingDraft,
      statuses: initialOnboardingStatuses,
    },
  );

  function completeStep<K extends OnboardingStepId>(stepId: K, data: OnboardingDraft[K]) {
    setSnapshot((current) => {
      const currentIndex = onboardingStepIds.indexOf(stepId);
      const nextStep = onboardingStepIds[currentIndex + 1];
      return {
        currentStep: nextStep ?? stepId,
        draft: { ...current.draft, [stepId]: data },
        statuses: {
          ...current.statuses,
          [stepId]: "COMPLETED",
          ...(nextStep === undefined || current.statuses[nextStep] === "COMPLETED"
            ? {}
            : { [nextStep]: "IN_PROGRESS" }),
        },
      };
    });
  }

  function saveAndGoBack<K extends OnboardingStepId>(stepId: K, data: OnboardingDraft[K]) {
    setSnapshot((current) => {
      const currentIndex = onboardingStepIds.indexOf(stepId);
      const previousStep = onboardingStepIds[Math.max(0, currentIndex - 1)] ?? "company";
      return {
        currentStep: previousStep,
        draft: { ...current.draft, [stepId]: data },
        statuses: { ...current.statuses, [stepId]: "IN_PROGRESS" },
      };
    });
  }

  function renderCurrentStep() {
    switch (snapshot.currentStep) {
      case "company":
        return <CompanyStep initialData={snapshot.draft.company} onComplete={(data) => completeStep("company", data)} />;
      case "offer":
        return <OfferStep initialData={snapshot.draft.offer} onBack={(data) => saveAndGoBack("offer", data)} onComplete={(data) => completeStep("offer", data)} />;
      case "target":
        return <TargetStep initialData={snapshot.draft.target} onBack={(data) => saveAndGoBack("target", data)} onComplete={(data) => completeStep("target", data)} />;
      case "qualification":
        return <QualificationStep initialData={snapshot.draft.qualification} onBack={(data) => saveAndGoBack("qualification", data)} onComplete={(data) => completeStep("qualification", data)} />;
      case "approach":
        return <ApproachStep initialData={snapshot.draft.approach} onBack={(data) => saveAndGoBack("approach", data)} onComplete={(data) => completeStep("approach", data)} />;
      case "tools":
        return <ToolsStep initialData={snapshot.draft.tools} onBack={(data) => saveAndGoBack("tools", data)} onComplete={(data) => completeStep("tools", data)} />;
      case "training":
        return <TrainingStep initialData={snapshot.draft.training} onBack={(data) => saveAndGoBack("training", data)} onComplete={(data) => completeStep("training", data)} />;
      case "launch":
        return <LaunchStep statuses={snapshot.statuses} completed={snapshot.statuses.launch === "COMPLETED"} onBack={(data) => saveAndGoBack("launch", data)} onComplete={(data) => completeStep("launch", data)} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-zinc-950">Nouveau client</p>
        <Link href="/backoffice/clients" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Quitter l’onboarding</Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <WizardProgress currentStep={snapshot.currentStep} statuses={snapshot.statuses} />
        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 lg:p-10">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
