import { z } from "zod";
import type { Pagination } from "@/shared/api/api-envelope";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema, paginatedEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { leadProspectSchema } from "../schemas/lead-prospect-schema";
import { leadProspectDetailSchema } from "../schemas/lead-prospect-detail-schema";
import type { KnownLeadOutcome, LeadProspect, LeadStatus } from "../model/lead-prospect";
import type { LeadProspectDetail } from "../model/lead-prospect-detail";

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
  getDetail: (
    workspaceId: WorkspaceId,
    leadId: string,
    signal?: AbortSignal,
  ) => Promise<LeadProspectDetail>;
  /** `POST .../prospects/{leadId}/draft-regeneration` — 202: the new draft
   * appears pending approval at the worker's next turn (under a minute). */
  requestDraftRegeneration: (
    workspaceId: WorkspaceId,
    leadId: string,
    signal?: AbortSignal,
  ) => Promise<DraftRegenerationRequest>;
  /** `PUT .../prospects/{leadId}/outcome` — returns the updated detail. */
  setOutcome: (
    workspaceId: WorkspaceId,
    leadId: string,
    outcome: KnownLeadOutcome,
    signal?: AbortSignal,
  ) => Promise<LeadProspectDetail>;
}

export interface DraftRegenerationRequest {
  leadId: string;
  status: string;
  remainingRegenerations: number;
}

const draftRegenerationResponseSchema = detailEnvelopeSchema(
  z.object({
    leadId: z.string(),
    status: z.string(),
    remainingRegenerations: z.number().int().nonnegative(),
  }),
);

const prospectsResponseSchema = paginatedEnvelopeSchema(leadProspectSchema);
const prospectDetailResponseSchema = detailEnvelopeSchema(leadProspectDetailSchema);

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

    async getDetail(workspaceId, leadId, signal) {
      const response = await client.request(
        `/organizations/${workspaceId}/prospects/${leadId}`,
        {
          method: "GET",
          context: { workspaceId },
          schema: prospectDetailResponseSchema,
          ...(signal === undefined ? {} : { signal }),
        },
      );
      return response.data;
    },

    async requestDraftRegeneration(workspaceId, leadId, signal) {
      const response = await client.request(
        `/organizations/${workspaceId}/prospects/${leadId}/draft-regeneration`,
        {
          method: "POST",
          context: { workspaceId },
          schema: draftRegenerationResponseSchema,
          ...(signal === undefined ? {} : { signal }),
        },
      );
      return response.data;
    },

    async setOutcome(workspaceId, leadId, outcome, signal) {
      const response = await client.request(
        `/organizations/${workspaceId}/prospects/${leadId}/outcome`,
        {
          method: "PUT",
          context: { workspaceId },
          body: { outcome },
          schema: prospectDetailResponseSchema,
          ...(signal === undefined ? {} : { signal }),
        },
      );
      return response.data;
    },
  };
}
