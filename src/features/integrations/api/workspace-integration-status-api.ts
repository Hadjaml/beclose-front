import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import {
  googleIntegrationStatusSchema,
  notionIntegrationStatusSchema,
} from "../schemas/workspace-integration-status-schema";
import type { WorkspaceIntegrationStatus } from "../model/workspace-integration-status";

export interface WorkspaceIntegrationStatusApi {
  get: (workspaceId: WorkspaceId, signal?: AbortSignal) => Promise<WorkspaceIntegrationStatus>;
}

const integrationsResponseSchema = detailEnvelopeSchema(
  z.object({
    google: googleIntegrationStatusSchema.nullable(),
    /** Absent on a backend without the Notion connector. */
    notion: notionIntegrationStatusSchema.nullable().default(null),
  }),
);

export function createWorkspaceIntegrationStatusApi(client: ApiClient): WorkspaceIntegrationStatusApi {
  return {
    async get(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/integrations`, {
        method: "GET",
        context: { workspaceId },
        schema: integrationsResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return { workspaceId, google: response.data.google, notion: response.data.notion };
    },
  };
}
