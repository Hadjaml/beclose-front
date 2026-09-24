import type { WorkspaceId } from "./workspace";

export const NEW_CLIENT_ONBOARDING_PATH = "/backoffice/clients/new";

/** The onboarding of an organization that already exists. The organization
 * lives in the URL so a reload, a bookmark or a link from the clients list
 * resumes the same organization instead of starting over. `step` asks for a
 * NEW version of that policy even though one exists (policies are versioned,
 * append-only), prefilled from the active one — the way to correct a profile. */
export type PolicyStep = "icp" | "bant";

export function resumeOnboardingHref(workspaceId: WorkspaceId, step?: PolicyStep): string {
  const base = `${NEW_CLIENT_ONBOARDING_PATH}?organization=${encodeURIComponent(workspaceId)}`;
  return step === undefined ? base : `${base}&step=${step}`;
}
