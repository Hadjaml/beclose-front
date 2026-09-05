import type { Prospect } from "@/features/prospecting";
import type { z } from "zod";
import type {
  conversationIntentSchema,
  conversationListSchema,
  conversationMessageSchema,
  conversationParticipantKindSchema,
  conversationParticipantSchema,
  conversationRecommendationSchema,
  conversationSchema,
  conversationStateSchema,
  messageDirectionSchema,
  progressiveQualificationSchema,
  qualificationFieldSchema,
  qualificationKnowledgeSchema,
  recommendedConversationActionSchema,
} from "../schemas/conversation-schemas";
import type { conversationLearningReviewSchema } from "../schemas/conversation-review-schema";

export type ConversationParticipantKind = z.infer<typeof conversationParticipantKindSchema>;
export type MessageDirection = z.infer<typeof messageDirectionSchema>;
export type ConversationState = z.infer<typeof conversationStateSchema>;
export type ConversationIntent = z.infer<typeof conversationIntentSchema>;
export type QualificationKnowledge = z.infer<typeof qualificationKnowledgeSchema>;
export type RecommendedConversationAction = z.infer<typeof recommendedConversationActionSchema>;
export type ConversationParticipant = z.infer<typeof conversationParticipantSchema>;
export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
export type QualificationField = z.infer<typeof qualificationFieldSchema>;
export type ProgressiveQualification = z.infer<typeof progressiveQualificationSchema>;
export type ConversationRecommendation = z.infer<typeof conversationRecommendationSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationList = z.infer<typeof conversationListSchema>;
export type ConversationLearningReview = z.infer<typeof conversationLearningReviewSchema>;

export interface ConversationInboxItem {
  conversation: Conversation;
  prospect: Prospect;
}

export const conversationStateLabels = {
  ACTIVE: "Système actif",
  WAITING: "En attente",
  MONITORING: "À surveiller",
  INTERVENTION_REQUIRED: "Intervention nécessaire",
  RESOLVED: "Terminée",
  ERROR: "Erreur",
} as const satisfies Record<ConversationState, string>;

export const conversationIntentLabels = {
  INTERESTED: "Intéressé",
  NEEDS_INFORMATION: "Demande des informations",
  OBJECTION: "Exprime une objection",
  NOT_NOW: "Pas maintenant",
  NOT_INTERESTED: "Pas intéressé",
  WRONG_CONTACT: "Mauvais interlocuteur",
  CALLBACK_LATER: "À recontacter plus tard",
  UNKNOWN: "À déterminer",
} as const satisfies Record<ConversationIntent, string>;

export const qualificationKnowledgeLabels = {
  KNOWN: "Connu",
  UNKNOWN: "Inconnu",
  TO_CONFIRM: "À confirmer",
} as const satisfies Record<QualificationKnowledge, string>;

export const recommendedConversationActionLabels = {
  CONTINUE_AUTOMATICALLY: "Laisser le système poursuivre",
  WAIT: "Attendre",
  FOLLOW_UP: "Relancer",
  ASK_INFORMATION: "Demander une information",
  PROPOSE_APPOINTMENT: "Proposer un rendez-vous",
  HUMAN_HANDOFF: "Reprendre humainement",
  STOP: "Arrêter la conversation",
} as const satisfies Record<RecommendedConversationAction, string>;

export const conversationParticipantKindLabels = {
  PROSPECT: "Prospect",
  BEWISE_AGENT: "Agent Bewise",
  HUMAN: "Humain",
} as const satisfies Record<ConversationParticipantKind, string>;
