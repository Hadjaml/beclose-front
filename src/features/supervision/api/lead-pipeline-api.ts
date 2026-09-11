import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { leadCountsSchema } from "../schemas/lead-pipeline-schema";
import type { WorkspaceLeadPipeline } from "../model/lead-pipeline";

export interface LeadPipelineApi {
  getOverview: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<WorkspaceLeadPipeline>;
}

/** Wire shape of Beclose's `OverviewOut` — `organizationId` renamed to
 * `workspaceId` at the boundary (organizationId ≡ workspaceId, confirmed). */
const overviewResponseSchema = detailEnvelopeSchema(
  z
    .object({
      organizationId: z.string().trim().min(1),
      totalLeads: z.number().int().nonnegative(),
      leadCounts: leadCountsSchema,
    })
    .transform(
      (raw): WorkspaceLeadPipeline => ({
        workspaceId: raw.organizationId,
        totalLeads: raw.totalLeads,
        leadCounts: raw.leadCounts,
      }),
    ),
);

export function createLeadPipelineApi(client: ApiClient): LeadPipelineApi {
  return {
    async getOverview(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/overview`, {
        method: "GET",
        context: { workspaceId },
        schema: overviewResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
