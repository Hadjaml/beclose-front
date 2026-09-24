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

/**
 * Outcome of `POST /organizations/{id}/archive` (24/09/2026). Each
 * disconnection carries a status string, kept as-is (not narrowed to the
 * currently-known values) so a value Beclose adds later degrades to a
 * generic "check by hand" instead of failing the whole response. Known
 * values — gmail: `none` | `revoked` | `removed_locally_only`; telegram:
 * `none` | `left_group` | `cleared_locally_only`. Every `*_locally_only`
 * means Beclose could clean its own side but NOT the external one — needs
 * a manual check, never a plain "OK".
 */
export interface ArchiveResult {
  client: ClientSummary;
  disconnections: { gmail: string; telegram: string };
}

export interface ClientsListOptions {
  includeArchived?: boolean;
}

export interface ClientsApi {
  list: (options?: ClientsListOptions, signal?: AbortSignal) => Promise<readonly ClientSummary[]>;
  archive: (workspaceId: string, signal?: AbortSignal) => Promise<ArchiveResult>;
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
    // Tolerant: absent on a Beclose build that predates archiving.
    archivedAt: z.string().nullable().default(null),
    icpActive: z.boolean().nullable().default(null),
    bantActive: z.boolean().nullable().default(null),
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
      archivedAt: org.archivedAt,
      icpActive: org.icpActive,
      bantActive: org.bantActive,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    }),
  );

const organizationsListResponseSchema = listEnvelopeSchema(organizationResponseSchema);
const organizationEnvelopeResponseSchema = detailEnvelopeSchema(organizationResponseSchema);
const archiveResponseSchema = detailEnvelopeSchema(
  z.object({
    organization: organizationResponseSchema,
    disconnections: z.object({ gmail: z.string(), telegram: z.string() }),
  }),
);

export function createClientsApi(client: ApiClient): ClientsApi {
  return {
    async list(options, signal) {
      const response = await client.request("/organizations", {
        method: "GET",
        schema: organizationsListResponseSchema,
        ...(options?.includeArchived === true ? { query: { includeArchived: true } } : {}),
        ...(signal === undefined ? {} : { signal }),
      });
      return response.data;
    },
    async archive(workspaceId, signal) {
      const response = await client.request(`/organizations/${workspaceId}/archive`, {
        method: "POST",
        context: { workspaceId },
        schema: archiveResponseSchema,
        ...(signal === undefined ? {} : { signal }),
      });
      return {
        client: response.data.organization,
        disconnections: response.data.disconnections,
      };
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
