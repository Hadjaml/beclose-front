import type { z } from "zod";
import type {
  agentExecutionStateSchema,
  conversationOwnerSchema,
  conversationOwnershipSchema,
  handoffActionSchema,
  handoffPrioritySchema,
  handoffRecommendationSchema,
} from "../schemas/handoff-schemas";

export type ConversationOwner = z.infer<typeof conversationOwnerSchema>;
export type AgentExecutionState = z.infer<typeof agentExecutionStateSchema>;
export type HandoffPriority = z.infer<typeof handoffPrioritySchema>;
export type HandoffRecommendation = z.infer<typeof handoffRecommendationSchema>;
export type ConversationOwnership = z.infer<typeof conversationOwnershipSchema>;
export type HandoffAction = z.infer<typeof handoffActionSchema>;

export const handoffPriorityLabels = {
  LOW: "Faible",
  MEDIUM: "Normale",
  HIGH: "Élevée",
  URGENT: "Urgente",
} as const satisfies Record<HandoffPriority, string>;
