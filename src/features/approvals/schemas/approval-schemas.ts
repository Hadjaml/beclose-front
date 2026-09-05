import { z } from "zod";
import {
  linkedResourceSchema,
  supervisionPrioritySchema,
} from "@/features/supervision";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const approvalStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "MODIFIED",
  "REJECTED",
  "EXPIRED",
  "CANCELED",
]);

export const approvalDomainSchema = z.enum([
  "PROSPECTING",
  "OUTREACH",
  "CONVERSATION",
  "QUALIFICATION",
  "LEARNING",
  "OTHER",
]);

export const approvalTypeSchema = z.enum([
  "PROSPECT_DECISION",
  "CONTACT_STRATEGY",
  "PROPOSED_MESSAGE",
  "QUALIFICATION",
  "LEARNING_RULE",
  "OTHER",
]);

export const approvalDeliveryChannelSchema = z.enum([
  "PORTAL",
  "CRM",
  "SLACK",
  "TEAMS",
  "EMAIL",
  "OTHER",
]);

export const approvalDeliveryStatusSchema = z.enum([
  "PENDING",
  "DELIVERED",
  "ACKNOWLEDGED",
  "FAILED",
]);

export const approvalDecisionOptionSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: optionalText,
});

export const approvalRecommendationSchema = z.object({
  summary: z.string().trim().min(1),
  reason: optionalText,
  recommendedOptionId: optionalText,
});

export const approvalDecisionActorSchema = z.object({
  id: z.string().trim().min(1),
  displayName: optionalText,
});

export const approvalDecisionSchema = z.object({
  optionId: z.string().trim().min(1),
  comment: optionalText,
  actor: approvalDecisionActorSchema,
  decidedAt: z.string().datetime({ offset: true }),
});

export const approvalDeliverySchema = z.object({
  channel: approvalDeliveryChannelSchema,
  status: approvalDeliveryStatusSchema,
  destinationLabel: optionalText,
  integrationConnectionId: optionalText,
  deliveredAt: optionalTimestamp,
  acknowledgedAt: optionalTimestamp,
  errorMessage: optionalText,
});

export const approvalSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  type: approvalTypeSchema,
  domain: approvalDomainSchema,
  resource: linkedResourceSchema.optional(),
  title: z.string().trim().min(1),
  context: optionalText,
  recommendation: approvalRecommendationSchema.optional(),
  decisionOptions: z.array(approvalDecisionOptionSchema),
  priority: supervisionPrioritySchema,
  createdAt: z.string().datetime({ offset: true }),
  expiresAt: optionalTimestamp,
  status: approvalStatusSchema,
  decision: approvalDecisionSchema.optional(),
  deliveries: z.array(approvalDeliverySchema).optional(),
});

export const approvalListSchema = z.array(approvalSchema);
