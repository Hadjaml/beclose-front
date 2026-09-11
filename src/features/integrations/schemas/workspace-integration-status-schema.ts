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
  connected: z.boolean(),
  expiresAt: z.string().nullable(),
  scopes: z.array(z.string()),
});

export const workspaceIntegrationStatusSchema = z.object({
  workspaceId: workspaceIdSchema,
  google: googleIntegrationStatusSchema.nullable(),
});
