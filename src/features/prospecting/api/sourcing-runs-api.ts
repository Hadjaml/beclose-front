import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * `POST /organizations/{id}/sourcing-runs` (point 18, 23/09/2026) — fire and
 * forget (`202 Accepted`), never a completion result: new leads show up in
 * `/prospects` over time, no run-tracking in V1 (Beclose's own docstring).
 * Every request field is optional on Beclose's side; this port only ever
 * sends `{}` (the "normal" case per Beclose: pilot sourcing from the
 * organization's active ICP profile, tier 1) — a real UI to pick a sector,
 * a specific company or other ICP tiers is a later step, not this one.
 */
export interface SourcingRunsApi {
  start: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<void>;
}

const sourcingRunResponseSchema = detailEnvelopeSchema(z.object({ status: z.string() }));

export function createSourcingRunsApi(client: ApiClient): SourcingRunsApi {
  return {
    async start(workspaceId, signal) {
      await client.request(`/organizations/${workspaceId}/sourcing-runs`, {
        method: "POST",
        context: { workspaceId },
        body: {},
        schema: sourcingRunResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
    },
  };
}
