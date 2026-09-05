import { onboardingDraftSchema } from "@/features/onboarding";

/**
 * The permanent configuration initially contains the same business information
 * collected during onboarding. Keeping this composition explicit prevents the
 * two experiences from defining competing contracts for the same data.
 */
export const clientConfigurationSchema = onboardingDraftSchema.pick({
  company: true,
  offer: true,
  target: true,
  qualification: true,
  approach: true,
  tools: true,
});
