import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

/**
 * Evidence retained for a future backend-created Learning event. The frontend
 * validates the review payload but never emits an event by itself.
 */
export const conversationLearningReviewSchema = z.object({
  workspaceId: workspaceIdSchema,
  conversationId: z.string().trim().min(1),
  subject: z.enum(["INTENT", "QUALIFICATION", "RECOMMENDED_REPLY", "HANDOFF"]),
  recommendation: z.unknown().refine((value) => value !== undefined),
  decision: z.enum(["CONFIRMED", "CORRECTED"]),
  correction: z.unknown().optional(),
  reason: z.string().trim().min(1).optional(),
});
