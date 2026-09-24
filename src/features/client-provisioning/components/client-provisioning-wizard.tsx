"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspaceConfigurationQuery } from "@/features/client-configuration";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { WizardProgress } from "@/shared/ui/forms";
import { resumeOnboardingHref } from "@/shared/workspace/onboarding-route";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import {
  clientProvisioningSteps,
  initialClientProvisioningStatuses,
} from "../model/client-provisioning";
import { deriveProvisioningProgress } from "../model/provisioning-progress";
import { BantStep } from "./steps/bant-step";
import { ConnectionsStep } from "./steps/connections-step";
import { IcpStep } from "./steps/icp-step";
import { OrganizationStep } from "./steps/organization-step";

/**
 * `organizationId` comes from the URL (`?organization=`): when present the
 * organization already exists and the step is read from what Beclose holds
 * for it (audit A06) — never from browser memory, which a reload wipes.
 */
export function ClientProvisioningWizard({
  organizationId,
  requestedStep = null,
}: {
  organizationId: WorkspaceId | null;
  /** `"icp"`: a new version of the ICP profile although one exists. */
  requestedStep?: "icp" | null;
}) {
  const router = useRouter();
  // Set right after the creation succeeds, before the URL below catches up,
  // so the organization step cannot be submitted a second time in between.
  const [createdId, setCreatedId] = useState<WorkspaceId | null>(null);
  const workspaceId = organizationId ?? createdId;

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
      {workspaceId === null ? (
        <WizardFrame currentStep="organization" statuses={initialClientProvisioningStatuses}>
          <OrganizationStep
            onCreated={(newWorkspaceId) => {
              setCreatedId(newWorkspaceId);
              router.replace(resumeOnboardingHref(newWorkspaceId));
            }}
          />
        </WizardFrame>
      ) : (
        <ExistingOrganizationSteps workspaceId={workspaceId} requestedStep={requestedStep} />
      )}
    </div>
  );
}

function WizardFrame({
  currentStep,
  statuses,
  children,
}: {
  currentStep: Parameters<typeof WizardProgress>[0]["currentStep"];
  statuses: Parameters<typeof WizardProgress>[0]["statuses"];
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
      <WizardProgress
        ariaLabel="Progression de la création du client"
        steps={clientProvisioningSteps}
        currentStep={currentStep}
        statuses={statuses}
      />
      <div className="min-w-0 rounded-app-lg border border-border bg-surface p-5 sm:p-8 lg:p-10">
        {children}
      </div>
    </div>
  );
}

function ExistingOrganizationSteps({
  workspaceId,
  requestedStep,
}: {
  workspaceId: WorkspaceId;
  requestedStep: "icp" | null;
}) {
  const router = useRouter();
  const query = useWorkspaceConfigurationQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement de l’organisation…" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Impossible de charger cette organisation"
        description="Sa configuration n’a pas pu être lue. L’organisation existe peut-être déjà : ne la recréez pas, réessayez ou retrouvez-la dans la liste des clients."
        onRetry={() => void query.refetch()}
      />
    );
  }

  const configuration = query.data;
  const derived = deriveProvisioningProgress({
    hasIcpProfile: configuration.icpProfile !== null,
    hasBantCriteria: configuration.qualificationCriteria !== null,
  });
  const revisingIcp = requestedStep === "icp";
  const progress = revisingIcp
    ? { currentStep: "icp" as const, statuses: { ...derived.statuses, icp: "IN_PROGRESS" as const } }
    : derived;

  return (
    <WizardFrame currentStep={progress.currentStep} statuses={progress.statuses}>
      {/* Each step is one-way and persisted by its own request; once it
          succeeds the configuration query is invalidated and the step
          derived above moves on by itself. */}
      {progress.currentStep === "icp" ? (
        <IcpStep
          workspaceId={workspaceId}
          workspaceName={configuration.name}
          onCreated={
            revisingIcp ? () => router.push(`/backoffice/workspaces/${workspaceId}/configuration`) : () => {}
          }
        />
      ) : null}
      {progress.currentStep === "bant" ? (
        <BantStep workspaceId={workspaceId} workspaceName={configuration.name} onCreated={() => {}} />
      ) : null}
      {progress.currentStep === "connections" ? (
        <ConnectionsStep
          workspaceId={workspaceId}
          telegramChatId={configuration.telegramChatId}
          onFinish={() => router.push(`/backoffice/workspaces/${workspaceId}/configuration`)}
        />
      ) : null}
    </WizardFrame>
  );
}
