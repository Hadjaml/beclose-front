import { z } from "zod";
import { contactChannelSchema } from "@/features/prospecting";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const outreachSequenceStatusSchema = z.enum([
  "DRAFT",
  "READY",
  "ACTIVE",
  "WAITING",
  "PAUSED",
  "STOPPED",
  "COMPLETED",
  "FAILED",
]);

export const contactAttemptKindSchema = z.enum(["FIRST_CONTACT", "FOLLOW_UP"]);

export const messageDeliveryStatusSchema = z.enum([
  "PREPARED",
  "SCHEDULED",
  "SENDING",
  "SENT",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
]);

export const preparedMessageSchema = z.object({
  id: optionalText,
  channel: contactChannelSchema,
  subject: optionalText,
  content: optionalText,
  channelPayload: z.unknown().optional(),
});

export const contactAttemptSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().positive(),
  kind: contactAttemptKindSchema,
  channel: contactChannelSchema,
  preparedMessage: preparedMessageSchema.optional(),
  deliveryStatus: messageDeliveryStatusSchema,
  scheduledAt: optionalTimestamp,
  sentAt: optionalTimestamp,
  completedAt: optionalTimestamp,
  delayBeforeNextAttemptSeconds: z.number().int().nonnegative().optional(),
});

export const nextOutreachActionSchema = z.object({
  kind: z.enum(["SEND", "WAIT", "FOLLOW_UP", "CHANGE_CHANNEL", "STOP"]),
  channel: contactChannelSchema.optional(),
  scheduledAt: optionalTimestamp,
  reason: optionalText,
});

/**
 * Categories are presentation semantics, not a definitive backend catalogue.
 * The free-form code preserves backend-specific reasons when the contract exists.
 */
export const outreachStopReasonSchema = z.object({
  category: z.enum([
    "RESPONSE_RECEIVED",
    "REFUSAL",
    "APPOINTMENT_BOOKED",
    "HUMAN_HANDOFF",
    "CONTACT_LATER",
    "SEQUENCE_LIMIT_REACHED",
    "CHANNEL_UNAVAILABLE",
    "ERROR",
    "OTHER",
  ]),
  code: optionalText,
  label: optionalText,
  detail: optionalText,
});

export const outreachSequenceSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  contactStrategyId: optionalText,
  status: outreachSequenceStatusSchema,
  channelOrder: z.array(contactChannelSchema).optional(),
  attempts: z.array(contactAttemptSchema),
  nextAction: nextOutreachActionSchema.optional(),
  stopReason: outreachStopReasonSchema.optional(),
  startedAt: optionalTimestamp,
  stoppedAt: optionalTimestamp,
});
