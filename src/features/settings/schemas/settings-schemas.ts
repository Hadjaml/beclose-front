import { z } from "zod";
import { authenticatedUserSchema } from "@/features/auth";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();

export const interfacePreferencesSchema = z.object({
  locale: optionalText,
  timezone: optionalText,
  reducedMotion: z.boolean().optional(),
});

export const settingsActionSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

export const settingsSchema = z.object({
  workspaceId: workspaceIdSchema.optional(),
  account: authenticatedUserSchema.optional(),
  preferences: interfacePreferencesSchema.optional(),
  organizationName: optionalText,
  actions: z.array(settingsActionSchema),
});
