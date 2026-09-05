import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();

export const conversationOwnerSchema = z.enum(["AGENT", "HUMAN"]);
export const agentExecutionStateSchema = z.enum(["ACTIVE", "SUSPENDED"]);
export const handoffPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const handoffRecommendationSchema = z.object({
  recommended: z.boolean(),
  priority: handoffPrioritySchema.optional(),
  reason: optionalText,
  recommendedAt: z.string().datetime({ offset: true }).optional(),
  triggers: z.array(z.string().trim().min(1)).optional(),
});

export const conversationOwnershipSchema = z.object({
  owner: conversationOwnerSchema,
  agentState: agentExecutionStateSchema,
  humanOwnerId: optionalText,
  humanOwnerLabel: optionalText,
  changedAt: z.string().datetime({ offset: true }).optional(),
});

export const handoffActionSchema = z.object({
  workspaceId: workspaceIdSchema,
  conversationId: z.string().trim().min(1),
  action: z.enum(["TAKE_OVER", "LET_AGENT_CONTINUE", "RETURN_TO_AGENT"]),
  recommendation: handoffRecommendationSchema.optional(),
  reason: optionalText,
});
