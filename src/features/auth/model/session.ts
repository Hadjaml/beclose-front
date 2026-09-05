import type { Permission } from "@/features/access-control";
import type { WorkspaceId } from "@/shared/workspace/workspace";

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
}

export interface Session {
  id: string;
  user: AuthenticatedUser;
  expiresAt: string;
}

export interface WorkspaceMembership {
  workspaceId: WorkspaceId;
  roleIds: readonly string[];
  effectivePermissions: readonly Permission[];
}
