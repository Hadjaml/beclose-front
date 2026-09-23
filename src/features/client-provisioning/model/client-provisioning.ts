import type { WizardStepDefinition, WizardStepStatus } from "@/shared/ui/forms";

/**
 * Real client-provisioning flow (EF-601/602, 2026-09-23): create an
 * organization, then its ICP profile, then its BANT grid — each step
 * persisted immediately via its own atomic endpoint (decision recorded
 * 2026-09-23: no giant local draft submitted at the end, unlike the old
 * free-text onboarding prototype it replaces, which was never wired to any
 * API and left Rochinel thinking he had configured a real client).
 *
 * Steps are one-way: once a step's mutation succeeds, its data exists in
 * Beclose — there is no `PATCH /organizations/{id}` or update-in-place
 * endpoint, so "going back" cannot un-create anything. Only the very first
 * step (before any mutation has run) can be edited freely.
 */
export type ClientProvisioningStepId = "organization" | "icp" | "bant" | "gmail";

export const clientProvisioningStepIds: readonly ClientProvisioningStepId[] = [
  "organization",
  "icp",
  "bant",
  "gmail",
];

export const clientProvisioningSteps: readonly WizardStepDefinition<ClientProvisioningStepId>[] = [
  { id: "organization", label: "Organisation" },
  { id: "icp", label: "Profil ICP" },
  { id: "bant", label: "Grille BANT" },
  { id: "gmail", label: "Connexion Gmail" },
];

export const initialClientProvisioningStatuses: Record<ClientProvisioningStepId, WizardStepStatus> = {
  organization: "IN_PROGRESS",
  icp: "NOT_STARTED",
  bant: "NOT_STARTED",
  gmail: "NOT_STARTED",
};
