import { z } from "zod";
import { policyStatusSchema, versionedPolicyEnvelopeSchema } from "@/shared/schemas/versioned-policy-envelope";

/**
 * Target ICP (Ideal Customer Profile) contract — WHO to target, applied
 * before/during sourcing. Rebuilt from scratch (not a retailor) against
 * `bewise_beclose_icp_bant_handoff.md` §10 and
 * `reponse_techlead_icp_bant.md` §3.1, decision A (icp_profiles validated
 * as an 11th table). Replaces the free-text `targetSegmentSchema`
 * (`onboarding-schemas.ts`) as the eventual target — that schema's own
 * comment already flagged itself as a placeholder.
 *
 * NOT WIRED: `icp_profiles` doesn't exist in Beclose yet (Nile starts the
 * migrations after this lands). No component consumes this. Types/schemas
 * only, per the current step's scope.
 */

export const commercialMaturityLevelSchema = z.enum(["M0", "M1", "M2", "M3", "M4"]);
export type CommercialMaturityLevel = z.infer<typeof commercialMaturityLevelSchema>;

const numericRangeSchema = z.object({
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
  hardFilter: z.boolean(),
});

const preferredMinimumSchema = z.object({
  preferredMinEur: z.number().nonnegative(),
  hardFilter: z.boolean(),
  reason: z.string().trim().min(1).optional(),
});

const decisionMakerTiersSchema = z.object({
  primary: z.array(z.string().trim().min(1)),
  secondary: z.array(z.string().trim().min(1)),
  potentialChampions: z.array(z.string().trim().min(1)),
});

const prioritySectorTierSchema = z.object({
  tier: z.number().int().min(1).max(3),
  sectors: z.array(z.string().trim().min(1)),
});

export const icpCriteriaSchema = z.object({
  schemaVersion: z.string().trim().min(1),

  market: z.object({
    businessModel: z.array(z.string().trim().min(1)),
    geographies: z.array(z.string().trim().min(1)),
    salesMotion: z.array(z.string().trim().min(1)),
  }),

  companyFit: z.object({
    employeeRange: numericRangeSchema,
    annualRevenue: preferredMinimumSchema,
    averageCustomerValue: preferredMinimumSchema,
    validatedOfferRequired: z.boolean(),
    existingCustomersRequired: z.boolean(),
    humanClosingCapacityRequired: z.boolean(),
  }),

  prioritySectors: z.array(prioritySectorTierSchema),

  commercialMaturity: z.object({
    preferredLevel: commercialMaturityLevelSchema,
    targetLevels: z.array(commercialMaturityLevelSchema),
    preferredLevels: z.array(commercialMaturityLevelSchema),
    excludedLevels: z.array(commercialMaturityLevelSchema),
  }),

  prospectability: z.object({
    companyAccountsIdentifiable: z.boolean(),
    decisionMakersIdentifiable: z.boolean(),
    supportedChannels: z.array(z.string().trim().min(1)),
    needDiscoverableThroughConversation: z.boolean(),
    commercialValueOfMeetingRequired: z.boolean(),
    humanAvailableToCloseRequired: z.boolean(),
  }),

  decisionMakers: decisionMakerTiersSchema,

  positiveSignals: z.array(z.string().trim().min(1)),
  negativeSignals: z.array(z.string().trim().min(1)),
  hardDisqualifiers: z.array(z.string().trim().min(1)),
});

export const icpProfileSchema = versionedPolicyEnvelopeSchema(icpCriteriaSchema);
export { policyStatusSchema as icpProfileStatusSchema };
