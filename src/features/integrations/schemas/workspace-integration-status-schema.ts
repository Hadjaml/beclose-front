import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

/**
 * Matches Beclose's real `/organizations/{id}/integrations`
 * (`IntegrationsOut`, `api/routers/organizations.py`) — derived from
 * `organization_credentials`. Deliberately separate from
 * `workspaceIntegrationsSchema` (`integration-schemas.ts`, a provider
 * catalogue with capabilities/actions/connection states like `CONNECTING`/
 * `NEEDS_ATTENTION`/`ERROR`): none of that exists backend-side, only a
 * Google credential row that is present or not, expired or not.
 */
export const googleIntegrationStatusSchema = z.object({
  /** `false` only when Google refused the refresh token (since 24/09/2026);
   * before, it flipped as soon as the ~1 h access token expired. */
  connected: z.boolean(),
  /** Expiry of the ACCESS token — information, not a connection state. */
  expiresAt: z.string().nullable(),
  scopes: z.array(z.string()),
  /** healthy | stale | degraded | reconnect_required | unknown. A plain
   * string (tolerant): `null` = a backend that predates it. */
  status: z.string().nullable().default(null),
  lastSuccessAt: z.string().nullable().default(null),
  lastFailureAt: z.string().nullable().default(null),
  /** refresh_refused | error — never the raw provider message. */
  lastFailureReason: z.string().nullable().default(null),
});

/** Notion connector (Beclose): `null` when the client has none. `status` and
 * `lastFailureReason` are Beclose's vocabulary — plain strings, tolerant. No
 * secret or database id is ever exposed. */
export const notionIntegrationStatusSchema = z.object({
  /** `false` only when `status` is `reconnect_required`. */
  connected: z.boolean(),
  /** healthy | degraded | reconnect_required | unknown */
  status: z.string().nullable().default(null),
  lastSuccessAt: z.string().nullable().default(null),
  lastFailureAt: z.string().nullable().default(null),
  /** unauthorized | database_unreachable | schema_mismatch | rate_limited | error */
  lastFailureReason: z.string().nullable().default(null),
  /** Prospects waiting to be copied into Notion. */
  pendingSyncs: z.number().int().nonnegative().default(0),
  /** Prospects whose retries are exhausted. */
  exhaustedSyncs: z.number().int().nonnegative().default(0),
});

export const workspaceIntegrationStatusSchema = z.object({
  workspaceId: workspaceIdSchema,
  google: googleIntegrationStatusSchema.nullable(),
  notion: notionIntegrationStatusSchema.nullable().default(null),
});
