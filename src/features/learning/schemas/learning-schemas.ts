import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

export const learningDomainSchema = z.enum([
  "TARGETING",
  "SCORING",
  "APPROACH_STRATEGY",
  "MESSAGES",
  "QUALIFICATION",
]);

export const autonomyStateSchema = z.enum([
  "INITIAL_LEARNING",
  "SUPERVISED",
  "PARTIAL_AUTONOMY",
  "STANDARD_CASE_AUTONOMY",
]);

export const humanDecisionSchema = z.enum(["CONFIRMED", "CORRECTED", "REJECTED"]);

export const humanValidationEventSchema = z.object({
  id: z.string().trim().min(1).optional(),
  workspaceId: workspaceIdSchema,
  domain: learningDomainSchema,
  recommendation: z.unknown().refine((value) => value !== undefined),
  decision: humanDecisionSchema,
  correction: z.unknown().optional(),
  reason: z.string().trim().min(1).optional(),
  occurredAt: z.string().datetime({ offset: true }).optional(),
});

export const proposedLearningRuleSchema = z.object({
  id: z.string().trim().min(1).optional(),
  statement: z.string().trim().min(1),
});

export const learningDomainSnapshotSchema = z.object({
  domain: learningDomainSchema,
  autonomyState: autonomyStateSchema,
  observedValidations: z.number().int().nonnegative().optional(),
  confirmations: z.number().int().nonnegative().optional(),
  corrections: z.number().int().nonnegative().optional(),
  insights: z.array(z.string().trim().min(1)).optional(),
  proposedRules: z.array(proposedLearningRuleSchema).optional(),
  validationHistoryAvailable: z.boolean().optional(),
});

export const learningOverviewSchema = z.array(learningDomainSnapshotSchema);
