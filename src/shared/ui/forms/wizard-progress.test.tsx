import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WizardProgress, type WizardStepStatus } from "./wizard-progress";

type StepId = "organization" | "icp" | "bant";

const steps = [
  { id: "organization" as const, label: "Organisation" },
  { id: "icp" as const, label: "Profil ICP" },
  { id: "bant" as const, label: "Grille BANT" },
];

describe("WizardProgress", () => {
  it("computes the completion percentage from COMPLETED steps only", () => {
    const statuses: Record<StepId, WizardStepStatus> = {
      organization: "COMPLETED",
      icp: "IN_PROGRESS",
      bant: "NOT_STARTED",
    };
    render(
      <WizardProgress ariaLabel="Progression" steps={steps} currentStep="icp" statuses={statuses} />,
    );

    expect(screen.getByText("1 sur 3 étapes")).toBeInTheDocument();
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("marks the current step with aria-current", () => {
    const statuses: Record<StepId, WizardStepStatus> = {
      organization: "COMPLETED",
      icp: "IN_PROGRESS",
      bant: "NOT_STARTED",
    };
    render(
      <WizardProgress ariaLabel="Progression" steps={steps} currentStep="icp" statuses={statuses} />,
    );

    expect(screen.getByText("Profil ICP").closest('[aria-current="step"]')).not.toBeNull();
    expect(screen.getByText("Organisation").closest('[aria-current="step"]')).toBeNull();
  });

  it("works with a step list that has nothing to do with onboarding's own step ids", () => {
    render(
      <WizardProgress
        ariaLabel="Progression"
        steps={steps}
        currentStep="organization"
        statuses={{ organization: "IN_PROGRESS", icp: "NOT_STARTED", bant: "NOT_STARTED" }}
      />,
    );

    expect(screen.getByText("Grille BANT")).toBeInTheDocument();
  });
});
