import { z } from "zod";

/**
 * Real wire shape of `icp_profiles.criteria` (the ICP profile JSONB), as
 * validated and written by Beclose's own `core.profiles.icp_schema.IcpProfileCriteria`
 * (`extra="forbid"`, plain `pydantic.BaseModel`, not camelCased — passed
 * through `/organizations/{id}/configuration` exactly as stored: snake_case).
 * Same rationale as `bant-criteria-wire-schema.ts` — deliberately separate
 * from the speculative target contract (`icp-profile-schema.ts`).
 */

const marketWireSchema = z
  .object({
    business_model: z.array(z.string()),
    geographies: z.array(z.string()),
    sales_motion: z.array(z.string()),
  })
  .transform((raw) => ({
    businessModel: raw.business_model,
    geographies: raw.geographies,
    salesMotion: raw.sales_motion,
  }));

/** `rejectBelow`/`rejectAbove` added by Beclose 2026-09-16 (headcount
 * tolerance) — absent from the target contract, which also has `min`/`max`
 * as optional where the real model requires them. */
const employeeRangeWireSchema = z
  .object({
    min: z.number().int(),
    max: z.number().int(),
    hard_filter: z.boolean(),
    reject_below: z.number().int().nullable().optional(),
    reject_above: z.number().int().nullable().optional(),
  })
  .transform((raw) => ({
    min: raw.min,
    max: raw.max,
    hardFilter: raw.hard_filter,
    rejectBelow: raw.reject_below ?? null,
    rejectAbove: raw.reject_above ?? null,
  }));

const annualRevenueWireSchema = z
  .object({
    preferred_min_eur: z.number(),
    hard_filter: z.boolean(),
  })
  .transform((raw) => ({ preferredMinEur: raw.preferred_min_eur, hardFilter: raw.hard_filter }));

/** Unlike `annualRevenue`, the real backend model gives this one an
 * optional `reason` — the target contract wrongly shares one schema
 * between the two. */
const averageCustomerValueWireSchema = z
  .object({
    preferred_min_eur: z.number(),
    hard_filter: z.boolean(),
    reason: z.string().nullable().optional(),
  })
  .transform((raw) => ({
    preferredMinEur: raw.preferred_min_eur,
    hardFilter: raw.hard_filter,
    reason: raw.reason ?? null,
  }));

const companyFitWireSchema = z
  .object({
    employee_range: employeeRangeWireSchema,
    annual_revenue: annualRevenueWireSchema,
    average_customer_value: averageCustomerValueWireSchema,
    validated_offer_required: z.boolean(),
    existing_customers_required: z.boolean(),
    human_closing_capacity_required: z.boolean(),
  })
  .transform((raw) => ({
    employeeRange: raw.employee_range,
    annualRevenue: raw.annual_revenue,
    averageCustomerValue: raw.average_customer_value,
    validatedOfferRequired: raw.validated_offer_required,
    existingCustomersRequired: raw.existing_customers_required,
    humanClosingCapacityRequired: raw.human_closing_capacity_required,
  }));

/** A sector can be a plain string (original V0 shape) or an object with an
 * optional French label for sourcing (`label_fr`) — normalized to one shape
 * here rather than forced into the target contract's `string[]`, which
 * would reject the object form outright. */
const prioritySectorWireSchema = z.union([
  z.string().trim().min(1).transform((id) => ({ id, labelFr: null as string | null })),
  z
    .object({ id: z.string().trim().min(1), label_fr: z.string().nullable().optional() })
    .transform((raw) => ({ id: raw.id, labelFr: raw.label_fr ?? null })),
]);

const prioritySectorTierWireSchema = z.object({
  tier: z.number().int(),
  sectors: z.array(prioritySectorWireSchema),
});

/** `levels` (a label map for each maturity level) exists on the real
 * backend model with no counterpart in the target contract. */
const commercialMaturityWireSchema = z
  .object({
    preferred_level: z.string(),
    levels: z.record(z.string(), z.string()),
    target_levels: z.array(z.string()),
    preferred_levels: z.array(z.string()),
    excluded_levels: z.array(z.string()),
  })
  .transform((raw) => ({
    preferredLevel: raw.preferred_level,
    levels: raw.levels,
    targetLevels: raw.target_levels,
    preferredLevels: raw.preferred_levels,
    excludedLevels: raw.excluded_levels,
  }));

const prospectabilityWireSchema = z
  .object({
    company_accounts_identifiable: z.boolean(),
    decision_makers_identifiable: z.boolean(),
    supported_channels: z.array(z.string()),
    need_discoverable_through_conversation: z.boolean(),
    commercial_value_of_meeting_required: z.boolean(),
    human_available_to_close_required: z.boolean(),
  })
  .transform((raw) => ({
    companyAccountsIdentifiable: raw.company_accounts_identifiable,
    decisionMakersIdentifiable: raw.decision_makers_identifiable,
    supportedChannels: raw.supported_channels,
    needDiscoverableThroughConversation: raw.need_discoverable_through_conversation,
    commercialValueOfMeetingRequired: raw.commercial_value_of_meeting_required,
    humanAvailableToCloseRequired: raw.human_available_to_close_required,
  }));

const decisionMakersWireSchema = z
  .object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
    potential_champions: z.array(z.string()),
  })
  .transform((raw) => ({
    primary: raw.primary,
    secondary: raw.secondary,
    potentialChampions: raw.potential_champions,
  }));

export const icpCriteriaWireSchema = z
  .object({
    schema_version: z.string(),
    profile_name: z.string(),
    purpose: z.string(),
    market: marketWireSchema,
    company_fit: companyFitWireSchema,
    priority_sectors: z.array(prioritySectorTierWireSchema),
    commercial_maturity: commercialMaturityWireSchema,
    prospectability: prospectabilityWireSchema,
    decision_makers: decisionMakersWireSchema,
    positive_signals: z.array(z.string()),
    negative_signals: z.array(z.string()),
    hard_disqualifiers: z.array(z.string()),
  })
  .transform((raw) => ({
    schemaVersion: raw.schema_version,
    profileName: raw.profile_name,
    purpose: raw.purpose,
    market: raw.market,
    companyFit: raw.company_fit,
    prioritySectors: raw.priority_sectors,
    commercialMaturity: raw.commercial_maturity,
    prospectability: raw.prospectability,
    decisionMakers: raw.decision_makers,
    positiveSignals: raw.positive_signals,
    negativeSignals: raw.negative_signals,
    hardDisqualifiers: raw.hard_disqualifiers,
  }));

export type IcpCriteriaWire = z.infer<typeof icpCriteriaWireSchema>;
