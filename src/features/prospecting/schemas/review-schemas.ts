import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";
import {
  contactStrategySchema,
  exclusionTypeSchema,
  targetingDecisionSchema,
} from "./prospect-schemas";

export const exclusionDraftSchema = z.object({
  type: exclusionTypeSchema,
  reasonCode: z.string().trim().min(1, "Choisissez un motif d’exclusion."),
  comment: z.string().trim().optional(),
});

const reviewIdentitySchema = z.object({
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  systemRecommendation: targetingDecisionSchema.optional(),
});

export const targetingReviewSchema = z.discriminatedUnion("decision", [
  reviewIdentitySchema.extend({
    decision: z.literal("CONTACT"),
  }),
  reviewIdentitySchema.extend({
    decision: z.literal("VERIFY"),
  }),
  reviewIdentitySchema.extend({
    decision: z.literal("EXCLUDE"),
    exclusion: exclusionDraftSchema,
  }),
]);

export const contactStrategyReviewSchema = z.object({
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  originalStrategy: contactStrategySchema.optional(),
  decision: z.enum(["APPROVE", "MODIFY"]),
  revisedStrategy: contactStrategySchema.optional(),
  reason: z.string().trim().min(1).optional(),
});
