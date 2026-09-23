import { z } from "zod";

/**
 * Request-body / form-draft shape for `POST /organizations/{id}/icp-profile`
 * (`criteria`), matching Beclose's real `IcpProfileCriteria`
 * (`core/profiles/icp_schema.py`, EF-601/602, 2026-09-23). That class now
 * accepts camelCase directly (`alias_generator=to_camel,
 * populate_by_name=True`) — unlike the GET-side wire shape
 * (`icp-criteria-wire-schema.ts`, which parses the snake_case JSONB Beclose
 * already has stored and never gets re-camelCased), this schema is native
 * camelCase both ways: it validates the creation form's draft AND is sent
 * as-is as the request body.
 *
 * Field requiredness mirrors Beclose's Pydantic model (a field with no
 * `default=` is required there; only `min(1)` on plain text fields is this
 * form's own guard — Beclose itself accepts an empty string for
 * `profileName`/`purpose`, but a blank "required" field serves no one).
 */

const marketFormSchema = z.object({
  businessModel: z.array(z.string().trim().min(1)),
  geographies: z.array(z.string().trim().min(1)),
  salesMotion: z.array(z.string().trim().min(1)),
});

export const employeeRangeFormSchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
  hardFilter: z.boolean(),
  rejectBelow: z.number().int().nullable(),
  rejectAbove: z.number().int().nullable(),
});
export type EmployeeRangeFormValue = z.infer<typeof employeeRangeFormSchema>;

const annualRevenueFormSchema = z.object({
  preferredMinEur: z.number().int().nonnegative(),
  hardFilter: z.boolean(),
});

const averageCustomerValueFormSchema = z.object({
  preferredMinEur: z.number().int().nonnegative(),
  hardFilter: z.boolean(),
  reason: z.string().trim().min(1).nullable(),
});

const companyFitFormSchema = z.object({
  employeeRange: employeeRangeFormSchema,
  annualRevenue: annualRevenueFormSchema,
  averageCustomerValue: averageCustomerValueFormSchema,
  validatedOfferRequired: z.boolean(),
  existingCustomersRequired: z.boolean(),
  humanClosingCapacityRequired: z.boolean(),
});

const prioritySectorFormSchema = z.object({
  id: z.string().trim().min(1),
  labelFr: z.string().trim().min(1).nullable(),
});
export type PrioritySectorFormValue = z.infer<typeof prioritySectorFormSchema>;

const prioritySectorTierFormSchema = z.object({
  tier: z.number().int().positive(),
  sectors: z.array(prioritySectorFormSchema),
});
export type PrioritySectorTierFormValue = z.infer<typeof prioritySectorTierFormSchema>;

/** `levels` is a `dict[str, str]` on Beclose's side (level key -> French
 * description) — edited here as an ordered list of pairs so
 * `RepeatableGroupField` can drive it, folded into a plain record before
 * submit via `toCommercialMaturityLevelsPayload`. Same treatment as
 * `bant-criteria-form-schema.ts`'s `qualificationRules`/`followUpDelayDays`. */
export const levelEntryFormSchema = z.object({
  key: z.string().trim().min(1),
  description: z.string().trim().min(1),
});
export type LevelEntryFormValue = z.infer<typeof levelEntryFormSchema>;

const commercialMaturityFormSchema = z.object({
  preferredLevel: z.string().trim().min(1),
  levels: z.array(levelEntryFormSchema),
  targetLevels: z.array(z.string()),
  preferredLevels: z.array(z.string()),
  excludedLevels: z.array(z.string()),
});

const prospectabilityFormSchema = z.object({
  companyAccountsIdentifiable: z.boolean(),
  decisionMakersIdentifiable: z.boolean(),
  supportedChannels: z.array(z.string().trim().min(1)),
  needDiscoverableThroughConversation: z.boolean(),
  commercialValueOfMeetingRequired: z.boolean(),
  humanAvailableToCloseRequired: z.boolean(),
});

const decisionMakersFormSchema = z.object({
  primary: z.array(z.string().trim().min(1)),
  secondary: z.array(z.string().trim().min(1)),
  potentialChampions: z.array(z.string().trim().min(1)),
});

export const icpCriteriaFormSchema = z.object({
  schemaVersion: z.string().trim().min(1),
  profileName: z.string().trim().min(1),
  purpose: z.string().trim().min(1),
  market: marketFormSchema,
  companyFit: companyFitFormSchema,
  prioritySectors: z.array(prioritySectorTierFormSchema),
  commercialMaturity: commercialMaturityFormSchema,
  prospectability: prospectabilityFormSchema,
  decisionMakers: decisionMakersFormSchema,
  positiveSignals: z.array(z.string().trim().min(1)),
  negativeSignals: z.array(z.string().trim().min(1)),
  hardDisqualifiers: z.array(z.string().trim().min(1)),
});
export type IcpCriteriaFormValue = z.infer<typeof icpCriteriaFormSchema>;

export const emptyIcpCriteriaDraft: IcpCriteriaFormValue = {
  schemaVersion: "1.0",
  profileName: "",
  purpose: "",
  market: { businessModel: [], geographies: [], salesMotion: [] },
  companyFit: {
    employeeRange: { min: 0, max: 0, hardFilter: false, rejectBelow: null, rejectAbove: null },
    annualRevenue: { preferredMinEur: 0, hardFilter: false },
    averageCustomerValue: { preferredMinEur: 0, hardFilter: false, reason: null },
    validatedOfferRequired: false,
    existingCustomersRequired: false,
    humanClosingCapacityRequired: false,
  },
  prioritySectors: [],
  commercialMaturity: {
    preferredLevel: "",
    levels: [],
    targetLevels: [],
    preferredLevels: [],
    excludedLevels: [],
  },
  prospectability: {
    companyAccountsIdentifiable: false,
    decisionMakersIdentifiable: false,
    supportedChannels: [],
    needDiscoverableThroughConversation: false,
    commercialValueOfMeetingRequired: false,
    humanAvailableToCloseRequired: false,
  },
  decisionMakers: { primary: [], secondary: [], potentialChampions: [] },
  positiveSignals: [],
  negativeSignals: [],
  hardDisqualifiers: [],
};

/** Folds the list-of-pairs editing shape of `commercialMaturity.levels`
 * back into the plain `Record<string, string>` Beclose expects. */
export function toCommercialMaturityLevelsPayload(levels: LevelEntryFormValue[]): Record<string, string> {
  return Object.fromEntries(levels.map((entry) => [entry.key, entry.description]));
}

/** The actual `POST /organizations/{id}/icp-profile` request body shape —
 * `IcpCriteriaFormValue` with `commercialMaturity.levels` folded from its
 * list-of-pairs editing shape into the `Record<string, string>` Beclose's
 * `IcpProfileCriteria.levels` expects. Everything else is identical, since
 * only `levels` needed a dict-shaped editing workaround. */
export type IcpCriteriaPayload = Omit<IcpCriteriaFormValue, "commercialMaturity"> & {
  commercialMaturity: Omit<IcpCriteriaFormValue["commercialMaturity"], "levels"> & {
    levels: Record<string, string>;
  };
};

export function toIcpCriteriaPayload(draft: IcpCriteriaFormValue): IcpCriteriaPayload {
  return {
    ...draft,
    commercialMaturity: {
      ...draft.commercialMaturity,
      levels: toCommercialMaturityLevelsPayload(draft.commercialMaturity.levels),
    },
  };
}
