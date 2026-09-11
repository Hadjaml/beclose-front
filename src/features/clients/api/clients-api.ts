import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { listEnvelopeSchema } from "@/shared/api/api-envelope";
import type { ClientSummary } from "../schemas/client-summary-schema";

export interface ClientsApi {
  list: (signal?: AbortSignal) => Promise<readonly ClientSummary[]>;
}

/**
 * Wire shape of Beclose's `OrganizationOut` — already camelCase
 * (`CamelModel`), only `id` differs from the domain's `workspaceId`.
 */
const organizationResponseSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    pitch: z.string().trim().min(1).nullable(),
    signature: z.string().trim().min(1).nullable(),
    telegramChatId: z.string().trim().min(1).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .transform(
    (org): ClientSummary => ({
      workspaceId: org.id,
      name: org.name,
      pitch: org.pitch,
      signature: org.signature,
      telegramChatId: org.telegramChatId,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    }),
  );

const organizationsListResponseSchema = listEnvelopeSchema(organizationResponseSchema);

export function createClientsApi(client: ApiClient): ClientsApi {
  return {
    async list(signal) {
      const response = await client.request("/organizations", {
        method: "GET",
        schema: organizationsListResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
