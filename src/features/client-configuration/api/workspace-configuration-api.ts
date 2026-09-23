import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { BantCriteriaPayload } from "../schemas/bant-criteria-form-schema";
import type { IcpCriteriaPayload } from "../schemas/icp-criteria-form-schema";
import { policyVersionSummarySchema, type PolicyVersionSummary } from "../schemas/policy-version-summary-schema";
import {
  icpProfileVersionSchema,
  qualificationCriteriaVersionSchema,
} from "../schemas/workspace-configuration-schema";
import type { WorkspaceConfiguration } from "../model/workspace-configuration";

export interface IcpProfileCreateRequest {
  name: string;
  notes: string | null;
  criteria: IcpCriteriaPayload;
}

export interface BantCriteriaCreateRequest {
  name: string;
  notes: string | null;
  criteria: BantCriteriaPayload;
}

export interface WorkspaceConfigurationApi {
  get: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<WorkspaceConfiguration>;
  createIcpProfileVersion: (
    workspaceId: WorkspaceId,
    request: IcpProfileCreateRequest,
    signal?: AbortSignal,
  ) => Promise<PolicyVersionSummary>;
  createBantCriteriaVersion: (
    workspaceId: WorkspaceId,
    request: BantCriteriaCreateRequest,
    signal?: AbortSignal,
  ) => Promise<PolicyVersionSummary>;
}

/** Wire shape of Beclose's `ConfigurationOut` — `organizationId` renamed to
 * `workspaceId` at the boundary. */
const configurationResponseSchema = detailEnvelopeSchema(
  z
    .object({
      organizationId: z.string().trim().min(1),
      name: z.string().trim().min(1),
      pitch: z.string().trim().min(1).nullable(),
      signature: z.string().trim().min(1).nullable(),
      telegramChatId: z.string().trim().min(1).nullable(),
      qualificationCriteria: qualificationCriteriaVersionSchema.nullable(),
      icpProfile: icpProfileVersionSchema.nullable(),
    })
    .transform(
      (raw): WorkspaceConfiguration => ({
        workspaceId: raw.organizationId,
        name: raw.name,
        pitch: raw.pitch,
        signature: raw.signature,
        telegramChatId: raw.telegramChatId,
        qualificationCriteria: raw.qualificationCriteria,
        icpProfile: raw.icpProfile,
      }),
    ),
);

const policyVersionCreateResponseSchema = detailEnvelopeSchema(policyVersionSummarySchema);

export function createWorkspaceConfigurationApi(client: ApiClient): WorkspaceConfigurationApi {
  return {
    async get(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/configuration`, {
        method: "GET",
        context: { workspaceId },
        schema: configurationResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
    async createIcpProfileVersion(workspaceId, request, signal) {
      const response = await client.request(`/organizations/${workspaceId}/icp-profile`, {
        method: "POST",
        context: { workspaceId },
        body: request,
        schema: policyVersionCreateResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
    async createBantCriteriaVersion(workspaceId, request, signal) {
      const response = await client.request(`/organizations/${workspaceId}/bant-criteria`, {
        method: "POST",
        context: { workspaceId },
        body: request,
        schema: policyVersionCreateResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
