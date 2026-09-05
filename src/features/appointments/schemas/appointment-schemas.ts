import { z } from "zod";
import { commercialAssignmentSchema } from "@/features/commercial-handoff";
import { contactChannelSchema } from "@/features/prospecting";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const appointmentStatusSchema = z.enum([
  "PROPOSED",
  "PENDING_CONFIRMATION",
  "BOOKED",
  "RESCHEDULE_REQUESTED",
  "CANCELED",
  "COMPLETED",
  "NO_SHOW",
]);

export const appointmentOriginSchema = z.enum([
  "SYSTEM_AUTOMATIC",
  "HUMAN_ASSISTED",
  "MANUAL",
  "EXTERNAL_IMPORT",
]);

export const crmSyncStatusSchema = z.enum([
  "NOT_SYNCED",
  "SYNCED",
  "ATTENTION",
  "ERROR",
]);

export const appointmentParticipantSchema = z.object({
  id: optionalText,
  kind: z.enum(["PROSPECT", "COMMERCIAL", "OTHER"]),
  referenceId: optionalText,
  displayName: optionalText,
  email: z.email().optional(),
});

export const appointmentLocationSchema = z.object({
  kind: z.enum(["VIDEO", "PHONE", "IN_PERSON", "OTHER"]),
  label: optionalText,
  address: optionalText,
  videoUrl: z.url().optional(),
  contactChannel: contactChannelSchema.optional(),
});

export const appointmentCancellationSchema = z.object({
  reasonCode: optionalText,
  reasonLabel: optionalText,
  comment: optionalText,
  canceledAt: optionalTimestamp,
});

export const appointmentRescheduleSchema = z.object({
  requestedAt: optionalTimestamp,
  previousStartAt: optionalTimestamp,
  reason: optionalText,
});

export const schedulingStatusSchema = z.enum([
  "RECOMMENDED",
  "PROPOSAL_IN_PROGRESS",
  "SLOTS_AVAILABLE",
  "SLOT_SELECTED",
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "RESCHEDULE_REQUESTED",
  "CANCELED",
]);

export const schedulingSlotSchema = z.object({
  id: z.string().trim().min(1),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1),
});

export const schedulingProcessSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  conversationId: z.string().trim().min(1),
  status: schedulingStatusSchema,
  availableSlots: z.array(schedulingSlotSchema).optional(),
  selectedSlotId: optionalText,
  selectedSlot: schedulingSlotSchema.optional(),
  recommendedAt: optionalTimestamp,
  proposedAt: optionalTimestamp,
  confirmedAt: optionalTimestamp,
});

export const appointmentSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  prospectId: z.string().trim().min(1),
  conversationId: z.string().trim().min(1),
  contactStrategyId: optionalText,
  schedulingProcessId: optionalText,
  participants: z.array(appointmentParticipantSchema),
  assignment: commercialAssignmentSchema,
  startsAt: optionalTimestamp,
  timezone: optionalText,
  durationMinutes: z.number().int().positive().optional(),
  location: appointmentLocationSchema.optional(),
  origin: appointmentOriginSchema,
  status: appointmentStatusSchema,
  cancellation: appointmentCancellationSchema.optional(),
  reschedule: appointmentRescheduleSchema.optional(),
  crmSyncStatus: crmSyncStatusSchema.optional(),
  bookedAt: optionalTimestamp,
  completedAt: optionalTimestamp,
  createdAt: optionalTimestamp,
  updatedAt: optionalTimestamp,
});

export const appointmentListSchema = z.array(appointmentSchema);
