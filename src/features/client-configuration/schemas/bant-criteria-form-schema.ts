import { z } from "zod";

/**
 * Request-body / form-draft shape for
 * `POST /organizations/{id}/bant-criteria` (`criteria`), matching Beclose's
 * real `BantCriteria` (`core/profiles/bant_schema.py`, EF-601/602,
 * 2026-09-23). Same rationale as `icp-criteria-form-schema.ts`: native
 * camelCase both ways, deliberately separate from the GET-side wire schema
 * (`bant-criteria-wire-schema.ts`, which parses already-stored snake_case).
 *
 * `customCriteria` (free-form `dict[str, Any] | None` on Beclose's side) has
 * no editable field in this form — genuinely unstructured data. It is only
 * carried through: `null` on a first creation, and the active version's
 * value when a new version is prefilled from it, so that versioning never
 * silently drops what an organization already had.
 */

const criterionBaseFormSchema = z.object({
  definition: z.string().trim().min(1),
  statusValues: z.array(z.string().trim().min(1)),
  questions: z.array(z.string().trim().min(1)),
});

export const budgetCriterionFormSchema = criterionBaseFormSchema.extend({
  positiveSignals: z.array(z.string().trim().min(1)),
  negativeSignals: z.array(z.string().trim().min(1)),
  explicitAmountRequired: z.boolean(),
});

export const authorityCriterionFormSchema = criterionBaseFormSchema.extend({
  decisionMakerTitles: z.array(z.string().trim().min(1)),
  championTitles: z.array(z.string().trim().min(1)),
});

export const needCriterionFormSchema = criterionBaseFormSchema.extend({
  strongSignals: z.array(z.string().trim().min(1)),
  moderateSignals: z.array(z.string().trim().min(1)),
  negativeSignals: z.array(z.string().trim().min(1)),
  disqualifiers: z.array(z.string().trim().min(1)),
});

export const timingCriterionFormSchema = criterionBaseFormSchema.extend({
  qualifiedHorizonDays: z.number().int().positive(),
  nurtureHorizonDays: z.number().int().positive(),
  negativeSignals: z.array(z.string().trim().min(1)),
});

/** A dict[str, list[str]] on Beclose's side, deliberately free-form (each
 * organization names its own rule keys) — represented here as an ordered
 * list of {key, values} pairs so `RepeatableGroupField` can edit it, then
 * folded into a plain record before submit. */
export const ruleEntryFormSchema = z.object({
  key: z.string().trim().min(1),
  values: z.array(z.string().trim().min(1)),
});
export type RuleEntryFormValue = z.infer<typeof ruleEntryFormSchema>;

export const qualificationRulesFormSchema = z.object({
  qualified: z.array(ruleEntryFormSchema),
  nurture: z.array(ruleEntryFormSchema),
});

export const handoffRulesFormSchema = z.object({
  explicitMeetingRequest: z.boolean(),
  strongNeedAndHumanRequest: z.boolean(),
  strongBuyingIntent: z.boolean(),
});

/** `followUpDelayDays` is a dict[str, int] on Beclose's side (statut timing
 * -> délai) — same list-of-pairs treatment as `qualificationRulesFormSchema`. */
export const delayEntryFormSchema = z.object({
  key: z.string().trim().min(1),
  days: z.number().int().nonnegative(),
});
export type DelayEntryFormValue = z.infer<typeof delayEntryFormSchema>;

export const nurtureRulesFormSchema = z.object({
  maxFollowUps: z.number().int().nonnegative(),
  followUpDelayDays: z.array(delayEntryFormSchema),
});

export const conversationPolicyFormSchema = z.object({
  avoidInterrogationStyle: z.boolean(),
  inferBeforeAsking: z.boolean(),
  preferContextualQuestions: z.boolean(),
  explicitBudgetQuestionOnlyWhenNeeded: z.boolean(),
});

export const bantCriteriaFormSchema = z.object({
  schemaVersion: z.string().trim().min(1),
  profileName: z.string().trim().min(1),
  budget: budgetCriterionFormSchema,
  authority: authorityCriterionFormSchema,
  need: needCriterionFormSchema,
  timing: timingCriterionFormSchema,
  qualificationRules: qualificationRulesFormSchema,
  handoffRules: handoffRulesFormSchema,
  nurtureRules: nurtureRulesFormSchema.nullable(),
  conversationPolicy: conversationPolicyFormSchema,
  customCriteria: z.record(z.string(), z.unknown()).nullable(),
});
export type BantCriteriaFormValue = z.infer<typeof bantCriteriaFormSchema>;

export const emptyBantCriteriaDraft: BantCriteriaFormValue = {
  schemaVersion: "1.0",
  profileName: "",
  budget: {
    definition: "",
    statusValues: [],
    questions: [],
    positiveSignals: [],
    negativeSignals: [],
    explicitAmountRequired: false,
  },
  authority: {
    definition: "",
    statusValues: [],
    questions: [],
    decisionMakerTitles: [],
    championTitles: [],
  },
  need: {
    definition: "",
    statusValues: [],
    questions: [],
    strongSignals: [],
    moderateSignals: [],
    negativeSignals: [],
    disqualifiers: [],
  },
  timing: {
    definition: "",
    statusValues: [],
    questions: [],
    qualifiedHorizonDays: 90,
    nurtureHorizonDays: 180,
    negativeSignals: [],
  },
  qualificationRules: { qualified: [], nurture: [] },
  handoffRules: {
    explicitMeetingRequest: false,
    strongNeedAndHumanRequest: false,
    strongBuyingIntent: false,
  },
  nurtureRules: null,
  conversationPolicy: {
    avoidInterrogationStyle: false,
    inferBeforeAsking: false,
    preferContextualQuestions: false,
    explicitBudgetQuestionOnlyWhenNeeded: false,
  },
  customCriteria: null,
};

/** Folds the list-of-pairs editing shape back into the plain
 * `Record<string, string[]>` / `Record<string, number>` Beclose expects. */
export function toQualificationRulesPayload(rules: { qualified: RuleEntryFormValue[]; nurture: RuleEntryFormValue[] }) {
  return {
    qualified: Object.fromEntries(rules.qualified.map((entry) => [entry.key, entry.values])),
    nurture: Object.fromEntries(rules.nurture.map((entry) => [entry.key, entry.values])),
  };
}

export function toFollowUpDelayDaysPayload(entries: DelayEntryFormValue[]): Record<string, number> {
  return Object.fromEntries(entries.map((entry) => [entry.key, entry.days]));
}

/** The actual `POST /organizations/{id}/bant-criteria` request body shape —
 * `BantCriteriaFormValue` with `qualificationRules.{qualified,nurture}` and
 * `nurtureRules.followUpDelayDays` folded from their list-of-pairs editing
 * shape into the `Record<...>` Beclose's `BantCriteria`/`QualificationRules`/
 * `NurtureRules` expect. */
export type BantCriteriaPayload = Omit<BantCriteriaFormValue, "qualificationRules" | "nurtureRules"> & {
  qualificationRules: {
    qualified: Record<string, string[]>;
    nurture: Record<string, string[]>;
  };
  nurtureRules: { maxFollowUps: number; followUpDelayDays: Record<string, number> } | null;
};

export function toBantCriteriaPayload(draft: BantCriteriaFormValue): BantCriteriaPayload {
  return {
    ...draft,
    qualificationRules: toQualificationRulesPayload(draft.qualificationRules),
    nurtureRules:
      draft.nurtureRules === null
        ? null
        : {
            maxFollowUps: draft.nurtureRules.maxFollowUps,
            followUpDelayDays: toFollowUpDelayDaysPayload(draft.nurtureRules.followUpDelayDays),
          },
  };
}
