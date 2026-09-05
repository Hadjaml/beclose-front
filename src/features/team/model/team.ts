import type { z } from "zod";
import type {
  accountStatusSchema,
  invitationStatusSchema,
  teamInvitationSchema,
  teamMemberSchema,
  teamOverviewSchema,
  teamUserSchema,
  teamWorkspaceAccessSchema,
} from "../schemas/team-schemas";

export type AccountStatus = z.infer<typeof accountStatusSchema>;
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;
export type TeamUser = z.infer<typeof teamUserSchema>;
export type TeamWorkspaceAccess = z.infer<typeof teamWorkspaceAccessSchema>;
export type TeamInvitation = z.infer<typeof teamInvitationSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamOverview = z.infer<typeof teamOverviewSchema>;

export const accountStatusLabels = {
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  DISABLED: "Désactivé",
} as const satisfies Record<AccountStatus, string>;

export const invitationStatusLabels = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  EXPIRED: "Expirée",
  REVOKED: "Révoquée",
} as const satisfies Record<InvitationStatus, string>;
