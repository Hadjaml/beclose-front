import type { z } from "zod";
import type {
  authenticatedUserSchema,
  loginCredentialsSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  sessionSchema,
  workspaceMembershipSchema,
} from "../schemas/session-schemas";

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type WorkspaceMembership = z.infer<typeof workspaceMembershipSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
