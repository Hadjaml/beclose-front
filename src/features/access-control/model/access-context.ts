import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Permission } from "./permission";

export interface AccessContext {
  actorUserId: string;
  workspaceId: WorkspaceId | null;
  effectivePermissions: readonly Permission[];
}

export function hasPermission(context: AccessContext, permission: Permission): boolean {
  return context.effectivePermissions.includes(permission);
}

export function hasAnyPermission(context: AccessContext, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => hasPermission(context, permission));
}

export function hasAllPermissions(context: AccessContext, permissions: readonly Permission[]): boolean {
  return permissions.every((permission) => hasPermission(context, permission));
}
