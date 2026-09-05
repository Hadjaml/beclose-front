import { z } from "zod";
import { conversationOwnershipSchema, handoffRecommendationSchema } from "@/features/human-handoff";
import { contactChannelSchema } from "@/features/prospecting";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const conversationParticipantKindSchema = z.enum([
  "PROSPECT",
  "BEWISE_AGENT",
  "HUMAN",
]);
export const messageDirectionSchema = z.enum(["INBOUND", "OUTBOUND"]);
export const conversationStateSchema = z.enum([
  "ACTIVE",
  "WAITING",
  "MONITORING",
  "INTERVENTION_REQUIRED",
  "RESOLVED",
  "ERROR",
]);
export const conversationIntentSchema = z.enum([
  "INTERESTED",
  "NEEDS_INFORMATION",
  "OBJECTION",
  "NOT_NOW",
  "NOT_INTERESTED",
  "WRONG_CONTACT",
  "CALLBACK_LATER",
  "UNKNOWN",
]);
export const qualificationKnowledgeSchema = z.enum(["KNOWN", "UNKNOWN", "TO_CONFIRM"]);
export const recommendedConversationActionSchema = z.enum([
  "CONTINUE_AUTOMATICALLY",
  "WAIT",
  "FOLLOW_UP",
  "ASK_INFORMATION",
  "PROPOSE_APPOINTMENT",
  "HUMAN_HANDOFF",
  "STOP",
]);

export const conversationParticipantSchema = z.object({
  id: z.string().trim().min(1),
  kind: conversationParticipantKindSchema,
  actorId: optionalText,
  displayName: optionalText,
});

export const conversationMessageSchema = z.object({
  id: z.string().trim().min(1),
  participantId: z.string().trim().min(1),
  authorKind: conversationParticipantKindSchema,
  direction: messageDirectionSchema,
  channel: contactChannelSchema,
  content: optionalText,
  sentAt: optionalTimestamp,
});

export const qualificationFieldSchema = z.object({
  state: qualificationKnowledgeSchema,
  information: optionalText,
});

export const qualificationCriterionSchema = z.object({
  id: optionalText,
  label: z.string().trim().min(1),
  state: qualificationKnowledgeSchema,
  information: optionalText,
});

export const progressiveQualificationSchema = z.object({
  budget: qualificationFieldSchema,
  authority: qualificationFieldSchema,
  need: qualificationFieldSchema,
  timing: qualificationFieldSchema,
  customCriteria: z.array(qualificationCriterionSchema).optional(),
  interestLevel: optionalText,
});

export const conversationRecommendationSchema = z.object({
  action: recommendedConversationActionSchema,
  justification: optionalText,
  recommendedAt: optionalTimestamp,
});

export const conversationSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  contactStrategyId: optionalText,
  outreachSequenceId: optionalText,
  state: conversationStateSchema,
  channel: contactChannelSchema.optional(),
  participants: z.array(conversationParticipantSchema),
  messages: z.array(conversationMessageSchema),
  summary: optionalText,
  intent: conversationIntentSchema.optional(),
  qualification: progressiveQualificationSchema.optional(),
  recommendation: conversationRecommendationSchema.optional(),
  ownership: conversationOwnershipSchema,
  handoffRecommendation: handoffRecommendationSchema.optional(),
  lastActivityAt: optionalTimestamp,
});

export const conversationListSchema = z.array(conversationSchema);
