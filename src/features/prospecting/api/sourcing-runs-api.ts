import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { sourcingRunSchema, type SourcingRun } from "../schemas/sourcing-run-schema";

/**
 * `POST /organizations/{id}/sourcing-runs` (point 18, 23/09/2026) — fire and
 * forget (`202 Accepted`), never a completion result: new leads show up in
 * `/prospects` over time (committed company by company). Since 24/09/2026
 * each run leaves a durable trace, read back through `list`
 * (`GET .../sourcing-runs`) — status, error and per-step report.
 * Every request field is optional on Beclose's side; this port only ever
 * sends `{}` (the "normal" case per Beclose: pilot sourcing from the
 * organization's active ICP profile, tier 1) — a real UI to pick a sector,
 * a specific company or other ICP tiers is a later step, not this one.
 */
export interface SourcingRunsApi {
  start: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<void>;
  /** Latest runs first (`GET .../sourcing-runs`, durable `sourcing_runs`). */
  list: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<readonly SourcingRun[]>;
}

const sourcingRunResponseSchema = detailEnvelopeSchema(z.object({ status: z.string() }));

const sourcingRunsListResponseSchema = detailEnvelopeSchema(z.array(sourcingRunSchema));

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
    async list(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/sourcing-runs`, {
        method: "GET",
        context: { workspaceId },
        schema: sourcingRunsListResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
