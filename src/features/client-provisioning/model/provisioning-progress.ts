import type { WizardStepStatus } from "@/shared/ui/forms";
import type { ClientProvisioningStepId } from "./client-provisioning";

export interface ProvisioningProgressInput {
  hasIcpProfile: boolean;
  hasBantCriteria: boolean;
}

export interface ProvisioningProgress {
  currentStep: ClientProvisioningStepId;
  statuses: Record<ClientProvisioningStepId, WizardStepStatus>;
}

/**
 * Where an organization that already exists stands in the onboarding, read
 * from what Beclose holds — never from memory of the browser session, which
 * a reload wipes (audit A06). The organization step is always done here (the
 * organization exists). The connections step has no persisted "done" state
 * (Gmail/Telegram are external), so it is the resting step once both
 * policies exist.
 */
export function deriveProvisioningProgress({
  hasIcpProfile,
  hasBantCriteria,
}: ProvisioningProgressInput): ProvisioningProgress {
  const currentStep: ClientProvisioningStepId = !hasIcpProfile
    ? "icp"
    : !hasBantCriteria
      ? "bant"
      : "connections";

  return {
    currentStep,
    statuses: {
      organization: "COMPLETED",
      icp: hasIcpProfile ? "COMPLETED" : currentStep === "icp" ? "IN_PROGRESS" : "NOT_STARTED",
      bant: hasBantCriteria ? "COMPLETED" : currentStep === "bant" ? "IN_PROGRESS" : "NOT_STARTED",
      connections: currentStep === "connections" ? "IN_PROGRESS" : "NOT_STARTED",
    },
  };
}
