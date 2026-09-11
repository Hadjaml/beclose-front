import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { ApiError, normalizeApiError } from "@/shared/api/api-error";
import type { AuthenticatedUser } from "../model/session";
import type {
  LoginCredentials,
  PasswordReset,
  PasswordResetRequest,
  Session,
} from "../model/session";

/**
 * Transport-neutral auth port. Its future implementation should rely on a
 * secure backend session, preferably an HttpOnly cookie.
 */
export interface AuthApi {
  getCurrentSession(signal?: AbortSignal): Promise<Session | null>;
  login(credentials: LoginCredentials): Promise<Session>;
  logout(): Promise<void>;
  requestPasswordReset(request: PasswordResetRequest): Promise<void>;
  resetPassword(request: PasswordReset): Promise<void>;
}

/**
 * Wire shape of Beclose's `StaffUserOut` (`api/routers/auth.py`), returned
 * as-is by `POST /auth/login` and `GET /auth/me`. Transformed at this API
 * boundary into the domain `AuthenticatedUser` shape (AGENTS.md: validate
 * external responses with Zod, infer types from the schema).
 */
const staffUserResponseSchema = z
  .object({
    id: z.string().trim().min(1),
    email: z.email(),
    full_name: z.string().trim().min(1),
  })
  .transform(
    (raw): AuthenticatedUser => ({
      id: raw.id,
      email: raw.email,
      displayName: raw.full_name,
    }),
  );

/**
 * `POST /auth/logout` responds `204 No Content` — the API client returns
 * `undefined` for that status (see `readResponseBody`).
 */
const emptyResponseSchema = z.undefined();

async function fetchSession(
  client: ApiClient,
  path: "/auth/login" | "/auth/me",
  options: { method?: "GET" | "POST"; body?: unknown; signal?: AbortSignal },
): Promise<Session> {
  const user = await client.request(path, { ...options, schema: staffUserResponseSchema });
  return { user };
}

/** Not implemented by Beclose: staff accounts are provisioned by Bewise via
 * `workers/create_staff_user.py`, there is no self-serve reset flow (see
 * ../../../.claude/skills/bewise-app/references/conventions.md). Throwing a
 * distinct "unsupported" ApiError rather than silently doing nothing or
 * calling an endpoint that doesn't exist. */
function unsupportedByBackend(message: string): Promise<never> {
  return Promise.reject(new ApiError({ kind: "unsupported", message }));
}

export function createAuthApi(client: ApiClient): AuthApi {
  return {
    async getCurrentSession(signal) {
      try {
        return await fetchSession(client, "/auth/me", { method: "GET", ...(signal === undefined ? {} : { signal }) });
      } catch (error) {
        const normalized = normalizeApiError(error);
        if (normalized.status === 401) return null;
        throw normalized;
      }
    },

    login(credentials) {
      return fetchSession(client, "/auth/login", { method: "POST", body: credentials });
    },

    async logout() {
      await client.request("/auth/logout", { method: "POST", schema: emptyResponseSchema });
    },

    requestPasswordReset() {
      return unsupportedByBackend(
        "Password reset has no backend counterpart yet — Beclose provisions staff accounts manually.",
      );
    },

    resetPassword() {
      return unsupportedByBackend(
        "Password reset has no backend counterpart yet — Beclose provisions staff accounts manually.",
      );
    },
  };
}
