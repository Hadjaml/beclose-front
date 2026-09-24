import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { approvalMetricsSchema, type ApprovalMetrics } from "../schemas/approval-metrics-schema";
import { precisionSchema, type Precision } from "../schemas/precision-schema";

/** The two real, read-only performance endpoints Beclose exposes (24/09/2026).
 * Distinct from the speculative `PerformanceApi` port (metrics/funnel/
 * insights), which nothing on the backend implements. */
export interface WorkspacePerformanceApi {
  getPrecision: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<Precision>;
  getApprovalMetrics: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<ApprovalMetrics>;
}

const precisionResponseSchema = detailEnvelopeSchema(precisionSchema);
const approvalMetricsResponseSchema = detailEnvelopeSchema(approvalMetricsSchema);

export function createWorkspacePerformanceApi(client: ApiClient): WorkspacePerformanceApi {
  return {
    async getPrecision(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/precision`, {
        method: "GET",
        context: { workspaceId },
        schema: precisionResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
    async getApprovalMetrics(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/approval-metrics`, {
        method: "GET",
        context: { workspaceId },
        schema: approvalMetricsResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
