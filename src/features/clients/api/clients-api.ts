import { z } from "zod";
import type { ApiClient } from "@/shared/api/api-client";
import { detailEnvelopeSchema, listEnvelopeSchema } from "@/shared/api/api-envelope";
import type { ClientSummary } from "../schemas/client-summary-schema";
import type { OrganizationCreateValue } from "../schemas/organization-create-schema";

/**
 * `PATCH /organizations/{id}` (point 18, 23/09/2026 — gap Lyra). Strict
 * PATCH semantics via Beclose's own `exclude_unset`: a key left out of the
 * request body is untouched; a key present with `null` clears that column
 * (all three nullable); `name` can never be cleared (`NOT NULL`), only
 * changed. Every field here stays optional so a caller only ever sends the
 * keys it actually means to change — `JSON.stringify` already drops
 * `undefined` keys, so a partial object like `{ telegramChatId: "..." }`
 * naturally serializes to exactly that, nothing more.
 */
export interface OrganizationUpdateValue {
  name?: string;
  pitch?: string | null;
  signature?: string | null;
  telegramChatId?: string | null;
}

export interface ClientsApi {
  list: (signal?: AbortSignal) => Promise<readonly ClientSummary[]>;
  create: (request: OrganizationCreateValue, signal?: AbortSignal) => Promise<ClientSummary>;
  update: (
    workspaceId: string,
    patch: OrganizationUpdateValue,
    signal?: AbortSignal,
  ) => Promise<ClientSummary>;
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
const organizationEnvelopeResponseSchema = detailEnvelopeSchema(organizationResponseSchema);

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
    async create(request, signal) {
      const response = await client.request("/organizations", {
        method: "POST",
        body: request,
        schema: organizationEnvelopeResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
    async update(workspaceId, patch, signal) {
      const response = await client.request(`/organizations/${workspaceId}`, {
        method: "PATCH",
        context: { workspaceId },
        body: patch,
        schema: organizationEnvelopeResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
  };
}
