import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const integrationCategorySchema = z.enum([
  "CRM",
  "MESSAGING",
  "CALENDAR",
  "INTERNAL_COMMUNICATION",
  "OTHER",
]);

export const integrationConnectionStatusSchema = z.enum([
  "NOT_CONNECTED",
  "CONNECTING",
  "CONNECTED",
  "NEEDS_ATTENTION",
  "ERROR",
  "DISCONNECTED",
]);

export const integrationProviderSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: integrationCategorySchema,
  description: optionalText,
});

export const integrationCapabilitySchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: optionalText,
  enabled: z.boolean(),
});

export const integrationActionSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  intent: z.enum(["PRIMARY", "SECONDARY", "DESTRUCTIVE"]).optional(),
});

export const integrationConnectionSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  providerId: z.string().trim().min(1),
  status: integrationConnectionStatusSchema,
  accountLabel: optionalText,
  ownerLabel: optionalText,
  capabilities: z.array(integrationCapabilitySchema),
  attentionMessage: optionalText,
  errorMessage: optionalText,
  actions: z.array(integrationActionSchema),
  lastSynchronizedAt: optionalTimestamp,
  createdAt: optionalTimestamp,
  updatedAt: optionalTimestamp,
});

export const workspaceIntegrationsSchema = z.object({
  workspaceId: workspaceIdSchema,
  providers: z.array(integrationProviderSchema),
  connections: z.array(integrationConnectionSchema),
});
