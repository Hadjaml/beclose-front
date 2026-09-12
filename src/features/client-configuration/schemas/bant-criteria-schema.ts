import { z } from "zod";
import { versionedPolicyEnvelopeSchema } from "@/shared/schemas/versioned-policy-envelope";

/**
 * Target BANT configuration contract — WHETHER an engaged prospect is a
 * real opportunity, applied during conversation. Retailors (not rebuilds)
 * the existing `qualificationStepSchema` (`onboarding-schemas.ts`): the
 * 4-criterion split already exists, this adds per-criterion status
 * values/signals/questions and the top-level rule objects the source
 * document specifies (`bewise_beclose_icp_bant_handoff.md` §16,
 * `reponse_techlead_icp_bant.md` §3.1/§4 decision B).
 *
 * NOT WIRED: `qualification_criteria` needs these fields added by Nile's
 * migrations first. Types/schemas only.
 */

export const budgetStatusSchema = z.enum(["validated", "probable", "unknown", "insufficient"]);

export const authorityStatusSchema = z.enum([
  "decision_maker",
  "champion",
  "influencer",
  "unknown",
  "no_authority",
]);

export const needStatusSchema = z.enum(["strong", "moderate", "weak", "none"]);

export const timingStatusSchema = z.enum([
  "0_90_days",
  "3_6_months",
  "over_6_months",
  "unknown",
]);

function criterionConfigSchema<T extends z.ZodTypeAny>(statusValueSchema: T) {
  return z.object({
    definition: z.string().trim().min(1),
    statusValues: z.array(statusValueSchema),
    positiveSignals: z.array(z.string().trim().min(1)),
    negativeSignals: z.array(z.string().trim().min(1)),
    questions: z.array(z.string().trim().min(1)),
  });
}

export const bantCriteriaSchema = z.object({
  schemaVersion: z.string().trim().min(1),

  budget: criterionConfigSchema(budgetStatusSchema).extend({
    explicitAmountRequired: z.boolean(),
  }),

  authority: criterionConfigSchema(authorityStatusSchema).extend({
    decisionMakerTitles: z.array(z.string().trim().min(1)),
    championTitles: z.array(z.string().trim().min(1)),
  }),

  need: criterionConfigSchema(needStatusSchema).extend({
    disqualifiers: z.array(z.string().trim().min(1)),
  }),

  timing: criterionConfigSchema(timingStatusSchema).extend({
    qualifiedHorizonDays: z.number().int().positive(),
    nurtureHorizonDays: z.number().int().positive(),
  }),

  qualificationRules: z.object({
    qualified: z.object({
      need: z.array(needStatusSchema),
      authority: z.array(authorityStatusSchema),
      timing: z.array(timingStatusSchema),
      budgetNot: z.array(budgetStatusSchema),
    }),
    nurture: z.object({
      need: z.array(needStatusSchema),
      timing: z.array(timingStatusSchema),
    }),
  }),

  handoffRules: z.object({
    explicitMeetingRequest: z.boolean(),
    strongNeedAndHumanRequest: z.boolean(),
    strongBuyingIntent: z.boolean(),
  }),

  conversationPolicy: z.object({
    avoidInterrogationStyle: z.boolean(),
    inferBeforeAsking: z.boolean(),
    preferContextualQuestions: z.boolean(),
    explicitBudgetQuestionOnlyWhenNeeded: z.boolean(),
  }),
});

export const bantCriteriaVersionSchema = versionedPolicyEnvelopeSchema(bantCriteriaSchema);
