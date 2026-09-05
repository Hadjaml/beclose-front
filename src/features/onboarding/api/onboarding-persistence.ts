import type { OnboardingWizardSnapshot } from "../model/onboarding";

/**
 * Extension point for the future backend draft/autosave contract.
 * No transport or persistence implementation exists in the frontend.
 */
export interface OnboardingDraftPersistence {
  load: (draftId: string, signal?: AbortSignal) => Promise<OnboardingWizardSnapshot>;
  save: (draftId: string, snapshot: OnboardingWizardSnapshot, signal?: AbortSignal) => Promise<void>;
}
