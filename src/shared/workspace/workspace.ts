import { z } from "zod";

export const workspaceIdSchema = z.string().trim().min(1);
export type WorkspaceId = z.infer<typeof workspaceIdSchema>;

export function parseWorkspaceId(value: unknown): WorkspaceId {
  return workspaceIdSchema.parse(value);
}
