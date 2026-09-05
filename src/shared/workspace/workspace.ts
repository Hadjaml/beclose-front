import { z } from "zod";

export const workspaceIdSchema = z.string().trim().min(1);
export type WorkspaceId = z.infer<typeof workspaceIdSchema>;

export const clientInteractionModeSchema = z.enum([
  "EXTERNAL_TOOLS",
  "BEWISE_PORTAL",
  "HYBRID",
]);
export type ClientInteractionMode = z.infer<typeof clientInteractionModeSchema>;

export const workspaceInteractionSettingsSchema = z.object({
  workspaceId: workspaceIdSchema,
  clientInteractionMode: clientInteractionModeSchema,
});
export type WorkspaceInteractionSettings = z.infer<
  typeof workspaceInteractionSettingsSchema
>;

export function parseWorkspaceId(value: unknown): WorkspaceId {
  return workspaceIdSchema.parse(value);
}
