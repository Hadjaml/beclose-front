import type { Pagination } from "@/shared/api/api-envelope";
import type { ApiClient } from "@/shared/api/api-client";
import { paginatedEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { leadProspectSchema } from "../schemas/lead-prospect-schema";
import type { LeadProspect, LeadStatus } from "../model/lead-prospect";

export interface LeadProspectsPage {
  data: readonly LeadProspect[];
  pagination: Pagination;
}

export interface LeadProspectsQuery {
  status?: LeadStatus;
  limit?: number;
  offset?: number;
}

export interface LeadProspectsApi {
  list: (
    workspaceId: WorkspaceId,
    query?: LeadProspectsQuery,
    signal?: AbortSignal,
  ) => Promise<LeadProspectsPage>;
}

const prospectsResponseSchema = paginatedEnvelopeSchema(leadProspectSchema);

export function createLeadProspectsApi(client: ApiClient): LeadProspectsApi {
  return {
    async list(workspaceId, query, signal) {
      return client.request(`/organizations/${workspaceId}/prospects`, {
        method: "GET",
        context: { workspaceId },
        schema: prospectsResponseSchema,
        query: {
          status: query?.status,
          limit: query?.limit,
          offset: query?.offset,
        },
        ...(signal === undefined ? {} : { signal }),
      });
    },
  };
}
