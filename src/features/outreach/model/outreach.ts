import type { z } from "zod";
import type {
  contactAttemptKindSchema,
  contactAttemptSchema,
  messageDeliveryStatusSchema,
  nextOutreachActionSchema,
  outreachSequenceSchema,
  outreachSequenceStatusSchema,
  outreachStopReasonSchema,
  preparedMessageSchema,
} from "../schemas/outreach-schemas";

export type OutreachSequenceStatus = z.infer<typeof outreachSequenceStatusSchema>;
export type ContactAttemptKind = z.infer<typeof contactAttemptKindSchema>;
export type MessageDeliveryStatus = z.infer<typeof messageDeliveryStatusSchema>;
export type PreparedMessage = z.infer<typeof preparedMessageSchema>;
export type ContactAttempt = z.infer<typeof contactAttemptSchema>;
export type NextOutreachAction = z.infer<typeof nextOutreachActionSchema>;
export type OutreachStopReason = z.infer<typeof outreachStopReasonSchema>;
export type OutreachSequence = z.infer<typeof outreachSequenceSchema>;

export const outreachSequenceStatusLabels = {
  DRAFT: "En préparation",
  READY: "Prête",
  ACTIVE: "Système actif",
  WAITING: "En attente",
  PAUSED: "Suspendue",
  STOPPED: "Arrêtée",
  COMPLETED: "Terminée",
  FAILED: "Erreur",
} as const satisfies Record<OutreachSequenceStatus, string>;

export const messageDeliveryStatusLabels = {
  PREPARED: "Message préparé",
  SCHEDULED: "Envoi prévu",
  SENDING: "Envoi en cours",
  SENT: "Envoyé",
  DELIVERED: "Distribué",
  FAILED: "Erreur",
  CANCELLED: "Annulé",
} as const satisfies Record<MessageDeliveryStatus, string>;

export const contactAttemptKindLabels = {
  FIRST_CONTACT: "Premier contact",
  FOLLOW_UP: "Relance",
} as const satisfies Record<ContactAttemptKind, string>;
