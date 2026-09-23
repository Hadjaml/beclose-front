import { z } from "zod";

/**
 * Real wire shape of `qualification_criteria.criteria` (the BANT grid JSONB),
 * as validated and written by Beclose's own `core.profiles.bant_schema.BantCriteria`
 * (`extra="forbid"`, plain `pydantic.BaseModel` — not the app's camelCase
 * `CamelModel`, so this JSONB blob is passed through `/organizations/{id}/configuration`
 * exactly as stored: snake_case, matching the Python field names verbatim.
 * Same pattern already established for `qualification_evaluation`/`icp_evaluation`
 * on the lead detail endpoint (`lead-prospect-detail-schema.ts`) — a real
 * wire shape, snake_case, normalized to camelCase here rather than forced
 * into the speculative target contract (`bant-criteria-schema.ts`, which
 * documents the shape the source cadrage document specifies but Beclose
 * does not implement — see gap analysis, 2026-09-23).
 *
 * Deliberately separate from `bantCriteriaSchema` — do not merge the two.
 */

const budgetCriterionWireSchema = z
  .object({
    definition: z.string(),
    status_values: z.array(z.string()),
    positive_signals: z.array(z.string()),
    negative_signals: z.array(z.string()),
    questions: z.array(z.string()),
    explicit_amount_required: z.boolean(),
  })
  .transform((raw) => ({
    definition: raw.definition,
    statusValues: raw.status_values,
    positiveSignals: raw.positive_signals,
    negativeSignals: raw.negative_signals,
    questions: raw.questions,
    explicitAmountRequired: raw.explicit_amount_required,
  }));

/** No positive/negative signals on the real backend model — unlike
 * `budget`/`timing`, `AuthorityCriterion` doesn't carry them at all. */
const authorityCriterionWireSchema = z
  .object({
    definition: z.string(),
    status_values: z.array(z.string()),
    decision_maker_titles: z.array(z.string()),
    champion_titles: z.array(z.string()),
    questions: z.array(z.string()),
  })
  .transform((raw) => ({
    definition: raw.definition,
    statusValues: raw.status_values,
    decisionMakerTitles: raw.decision_maker_titles,
    championTitles: raw.champion_titles,
    questions: raw.questions,
  }));

/** Three-way signal split (strong/moderate/negative), not the target
 * contract's two-way positive/negative. */
const needCriterionWireSchema = z
  .object({
    definition: z.string(),
    status_values: z.array(z.string()),
    strong_signals: z.array(z.string()),
    moderate_signals: z.array(z.string()),
    negative_signals: z.array(z.string()),
    disqualifiers: z.array(z.string()),
    questions: z.array(z.string()),
  })
  .transform((raw) => ({
    definition: raw.definition,
    statusValues: raw.status_values,
    strongSignals: raw.strong_signals,
    moderateSignals: raw.moderate_signals,
    negativeSignals: raw.negative_signals,
    disqualifiers: raw.disqualifiers,
    questions: raw.questions,
  }));

/** No positive signals on the real backend model — only `negative_signals`. */
const timingCriterionWireSchema = z
  .object({
    definition: z.string(),
    status_values: z.array(z.string()),
    qualified_horizon_days: z.number().int(),
    nurture_horizon_days: z.number().int(),
    questions: z.array(z.string()),
    negative_signals: z.array(z.string()),
  })
  .transform((raw) => ({
    definition: raw.definition,
    statusValues: raw.status_values,
    qualifiedHorizonDays: raw.qualified_horizon_days,
    nurtureHorizonDays: raw.nurture_horizon_days,
    questions: raw.questions,
    negativeSignals: raw.negative_signals,
  }));

/** Deliberately a free-form map on the real backend ("lues et évaluées
 * génériquement par le code... jamais de règle codée en dur", per Beclose's
 * own docstring) — each organization can name its own rule keys, unlike the
 * target contract's fixed `{qualified:{need,authority,timing,budgetNot},
 * nurture:{need,timing}}` shape. */
const qualificationRulesWireSchema = z.object({
  qualified: z.record(z.string(), z.array(z.string())),
  nurture: z.record(z.string(), z.array(z.string())),
});

/** Added by Beclose at step 5e (nurture follow-ups) — absent from the
 * target contract entirely. Optional: an organization without this section
 * simply receives no automatic nurture follow-up. */
const nurtureRulesWireSchema = z
  .object({
    max_follow_ups: z.number().int().nonnegative(),
    follow_up_delay_days: z.record(z.string(), z.number().int()),
  })
  .transform((raw) => ({
    maxFollowUps: raw.max_follow_ups,
    followUpDelayDays: raw.follow_up_delay_days,
  }));

const handoffRulesWireSchema = z
  .object({
    explicit_meeting_request: z.boolean(),
    strong_need_and_human_request: z.boolean(),
    strong_buying_intent: z.boolean(),
  })
  .transform((raw) => ({
    explicitMeetingRequest: raw.explicit_meeting_request,
    strongNeedAndHumanRequest: raw.strong_need_and_human_request,
    strongBuyingIntent: raw.strong_buying_intent,
  }));

const conversationPolicyWireSchema = z
  .object({
    avoid_interrogation_style: z.boolean(),
    infer_before_asking: z.boolean(),
    prefer_contextual_questions: z.boolean(),
    explicit_budget_question_only_when_needed: z.boolean(),
  })
  .transform((raw) => ({
    avoidInterrogationStyle: raw.avoid_interrogation_style,
    inferBeforeAsking: raw.infer_before_asking,
    preferContextualQuestions: raw.prefer_contextual_questions,
    explicitBudgetQuestionOnlyWhenNeeded: raw.explicit_budget_question_only_when_needed,
  }));

export const bantCriteriaWireSchema = z
  .object({
    schema_version: z.string(),
    profile_name: z.string(),
    budget: budgetCriterionWireSchema,
    authority: authorityCriterionWireSchema,
    need: needCriterionWireSchema,
    timing: timingCriterionWireSchema,
    qualification_rules: qualificationRulesWireSchema,
    handoff_rules: handoffRulesWireSchema,
    nurture_rules: nurtureRulesWireSchema.nullable().optional(),
    conversation_policy: conversationPolicyWireSchema,
    custom_criteria: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .transform((raw) => ({
    schemaVersion: raw.schema_version,
    profileName: raw.profile_name,
    budget: raw.budget,
    authority: raw.authority,
    need: raw.need,
    timing: raw.timing,
    qualificationRules: raw.qualification_rules,
    handoffRules: raw.handoff_rules,
    nurtureRules: raw.nurture_rules ?? null,
    conversationPolicy: raw.conversation_policy,
    customCriteria: raw.custom_criteria ?? null,
  }));

export type BantCriteriaWire = z.infer<typeof bantCriteriaWireSchema>;
