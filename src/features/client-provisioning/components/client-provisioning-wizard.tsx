"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WizardProgress } from "@/shared/ui/forms";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import {
  clientProvisioningSteps,
  initialClientProvisioningStatuses,
  type ClientProvisioningStepId,
} from "../model/client-provisioning";
import { BantStep } from "./steps/bant-step";
import { GmailConnectionStep } from "./steps/gmail-connection-step";
import { IcpStep } from "./steps/icp-step";
import { OrganizationStep } from "./steps/organization-step";

export function ClientProvisioningWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ClientProvisioningStepId>("organization");
  const [statuses, setStatuses] = useState(initialClientProvisioningStatuses);
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");

  function completeStep(stepId: ClientProvisioningStepId, nextStep: ClientProvisioningStepId | null) {
    setStatuses((current) => ({
      ...current,
      [stepId]: "COMPLETED",
      ...(nextStep === null ? {} : { [nextStep]: "IN_PROGRESS" }),
    }));
    if (nextStep !== null) setCurrentStep(nextStep);
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case "organization":
        return (
          <OrganizationStep
            onCreated={(newWorkspaceId, name) => {
              setWorkspaceId(newWorkspaceId);
              setWorkspaceName(name);
              completeStep("organization", "icp");
            }}
          />
        );
      case "icp":
        if (workspaceId === null) return null;
        return (
          <IcpStep
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            onCreated={() => completeStep("icp", "bant")}
          />
        );
      case "bant":
        if (workspaceId === null) return null;
        return (
          <BantStep
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            onCreated={() => completeStep("bant", "gmail")}
          />
        );
      case "gmail":
        if (workspaceId === null) return null;
        return (
          <GmailConnectionStep
            workspaceId={workspaceId}
            onFinish={() => {
              completeStep("gmail", null);
              router.push(`/backoffice/workspaces/${workspaceId}/configuration`);
            }}
          />
        );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-text-primary">Nouveau client</p>
        <Link
          href="/backoffice/clients"
          className="rounded-app-md px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
        >
          Quitter
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <WizardProgress
          ariaLabel="Progression de la création du client"
          steps={clientProvisioningSteps}
          currentStep={currentStep}
          statuses={statuses}
        />
        <div className="min-w-0 rounded-app-lg border border-border bg-surface p-5 sm:p-8 lg:p-10">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
