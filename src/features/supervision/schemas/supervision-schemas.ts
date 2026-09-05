import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const systemStatusSchema = z.enum([
  "ONBOARDING",
  "LEARNING",
  "ACTIVE",
  "NEEDS_ATTENTION",
  "PAUSED",
  "ERROR",
]);

export const supervisionPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const requiredActionTypeSchema = z.enum([
  "PROSPECT_REVIEW",
  "STRATEGY_VALIDATION",
  "CONVERSATION_HANDOFF",
  "APPOINTMENT_OWNERSHIP",
  "LEARNING_RULE_CONFIRMATION",
  "INTEGRATION_ERROR",
  "OTHER",
]);

export const linkedResourceSchema = z.object({
  type: z.string().trim().min(1),
  id: z.string().trim().min(1),
});

export const actionDestinationSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

export const requiredActionSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  type: requiredActionTypeSchema,
  priority: supervisionPrioritySchema,
  title: z.string().trim().min(1),
  reason: optionalText,
  occurredAt: optionalTimestamp,
  resource: linkedResourceSchema.optional(),
  destination: actionDestinationSchema.optional(),
});

export const activityActorSchema = z.object({
  kind: z.enum(["AGENT", "HUMAN", "SYSTEM", "INTEGRATION"]),
  id: optionalText,
  displayName: optionalText,
});

export const activityEventSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  actor: activityActorSchema,
  eventType: z.string().trim().min(1),
  occurredAt: z.string().datetime({ offset: true }),
  resource: linkedResourceSchema.optional(),
  summary: z.string().trim().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const workspaceSupervisionSummarySchema = z.object({
  workspaceId: workspaceIdSchema,
  workspaceName: z.string().trim().min(1),
  systemStatus: systemStatusSchema,
  attentionPriority: supervisionPrioritySchema.optional(),
  attentionReason: optionalText,
  progressSummary: optionalText,
  primaryResult: optionalText,
  lastActivityAt: optionalTimestamp,
});

export const systemResultSummarySchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  formattedValue: optionalText,
  description: optionalText,
});

export const nextRecommendationSchema = z.object({
  title: z.string().trim().min(1),
  reason: optionalText,
  destination: actionDestinationSchema.optional(),
});

export const workspaceSupervisionSchema = z.object({
  workspaceId: workspaceIdSchema,
  systemStatus: systemStatusSchema,
  statusReason: optionalText,
  requiredActions: z.array(requiredActionSchema),
  recentActivity: z.array(activityEventSchema),
  resultSummaries: z.array(systemResultSummarySchema).optional(),
  nextRecommendation: nextRecommendationSchema.optional(),
});

export const globalSupervisionSchema = z.object({
  workspaces: z.array(workspaceSupervisionSummarySchema),
  requiredActions: z.array(requiredActionSchema),
  recentActivity: z.array(activityEventSchema),
});
