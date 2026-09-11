import { z } from "zod";
import { permissionSchema } from "@/features/access-control";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

export const authenticatedUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.email(),
  displayName: z.string().trim().min(1),
});

/**
 * Beclose's `/auth/login` and `/auth/me` (Bewise-internal Back Office auth,
 * `api/routers/auth.py`) return only the current staff user — no session id
 * or expiry is exposed to the client, the `HttpOnly` cookie carries that
 * server-side. Don't add fields here the backend doesn't actually send.
 */
export const sessionSchema = z.object({
  user: authenticatedUserSchema,
});

export const workspaceMembershipSchema = z.object({
  workspaceId: workspaceIdSchema,
  roleIds: z.array(z.string().trim().min(1)),
  effectivePermissions: z.array(permissionSchema),
});

export const loginCredentialsSchema = z.object({
  email: z.email("Saisissez une adresse e-mail valide."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export const passwordResetRequestSchema = z.object({
  email: z.email("Saisissez une adresse e-mail valide."),
});

export const passwordResetSchema = z.object({
  resetToken: z.string().trim().min(1),
  password: z.string().min(8, "Utilisez au moins 8 caractères."),
});
