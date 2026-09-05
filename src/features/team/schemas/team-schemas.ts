import { z } from "zod";
import { permissionSchema } from "@/features/access-control";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const accountStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "DISABLED"]);
export const invitationStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
  "REVOKED",
]);

export const teamUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.email(),
  displayName: z.string().trim().min(1),
  accountStatus: accountStatusSchema,
});

export const teamWorkspaceAccessSchema = z.object({
  workspaceId: workspaceIdSchema,
  workspaceName: optionalText,
  roleIds: z.array(z.string().trim().min(1)),
  roleLabel: optionalText,
  effectivePermissions: z.array(permissionSchema),
});

export const teamInvitationSchema = z.object({
  id: z.string().trim().min(1),
  email: z.email(),
  status: invitationStatusSchema,
  roleLabel: optionalText,
  workspaceIds: z.array(workspaceIdSchema),
  invitedAt: optionalTimestamp,
  expiresAt: optionalTimestamp,
});

export const teamMemberSchema = z.object({
  user: teamUserSchema,
  accesses: z.array(teamWorkspaceAccessSchema),
});

export const teamOverviewSchema = z.object({
  members: z.array(teamMemberSchema),
  invitations: z.array(teamInvitationSchema),
});
