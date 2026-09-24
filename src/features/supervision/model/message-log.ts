import type { z } from "zod";
import { describeEnumValue } from "@/shared/schemas/tolerant-enum";
import type {
  interactionDirectionSchema,
  interactionDirectionValues,
  interactionStatusSchema,
  interactionStatusValues,
  messageLogEntrySchema,
} from "../schemas/message-log-schema";

export type KnownInteractionDirection = (typeof interactionDirectionValues)[number];
export type InteractionDirection = z.infer<typeof interactionDirectionSchema>;
/** Every message status this frontend knows; the backend may send others. */
export type KnownInteractionStatus = (typeof interactionStatusValues)[number];
export type InteractionStatus = z.infer<typeof interactionStatusSchema>;
export type MessageLogEntry = z.infer<typeof messageLogEntrySchema>;

export const interactionStatusLabels = {
  pending_approval: "En attente de validation",
  approved: "Approuvé",
  rejected: "Rejeté",
  sent: "Envoyé",
  superseded: "Remplacé par une correction",
  cancelled: "Annulé (désinscription ou disqualification)",
} as const satisfies Record<KnownInteractionStatus, string>;

/** Never throws on a status added by Beclose after this was written. */
export function interactionStatusLabel(status: InteractionStatus): string {
  return describeEnumValue(interactionStatusLabels, status);
}

export const interactionDirectionLabels = {
  outbound: "Sortant",
  inbound: "Entrant",
} as const satisfies Record<KnownInteractionDirection, string>;

export function interactionDirectionLabel(direction: InteractionDirection): string {
  return describeEnumValue(interactionDirectionLabels, direction, "Sens inconnu");
}
