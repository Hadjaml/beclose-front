import type { WorkspaceId } from "@/shared/workspace/workspace";

/** Opaque backend-issued delegation metadata. It never replaces the authenticated actor. */
export interface ViewAsClientContext {
  delegationId: string;
  actorUserId: string;
  workspaceId: WorkspaceId;
  expiresAt: string;
}

export function isViewAsClientContextActive(context: ViewAsClientContext, now: Date = new Date()): boolean {
  return Date.parse(context.expiresAt) > now.getTime();
}
