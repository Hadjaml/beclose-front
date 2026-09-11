import type { z } from "zod";
import type {
  interactionDirectionSchema,
  interactionStatusSchema,
  messageLogEntrySchema,
} from "../schemas/message-log-schema";

export type InteractionDirection = z.infer<typeof interactionDirectionSchema>;
export type InteractionStatus = z.infer<typeof interactionStatusSchema>;
export type MessageLogEntry = z.infer<typeof messageLogEntrySchema>;

export const interactionStatusLabels = {
  pending_approval: "En attente de validation",
  approved: "Approuvé",
  rejected: "Rejeté",
  sent: "Envoyé",
  superseded: "Remplacé par une correction",
} as const satisfies Record<InteractionStatus, string>;

export const interactionDirectionLabels = {
  outbound: "Sortant",
  inbound: "Entrant",
} as const satisfies Record<InteractionDirection, string>;
