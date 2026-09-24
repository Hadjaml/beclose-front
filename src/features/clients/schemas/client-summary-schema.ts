import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

/**
 * Matches Beclose's `OrganizationOut` (`api/routers/organizations.py`)
 * as-is — `id` renamed to `workspaceId` at the API boundary (see
 * `../api/clients-api.ts`); `organizationId` ≡ `workspaceId` was confirmed
 * 1:1 in the cross-repo API contract (2026-09-11). No `onboardingStatus`/
 * `systemStatus`/`subscriptionStatus`: Beclose has no such fields, don't
 * invent them.
 */
export const clientSummarySchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1),
  pitch: z.string().trim().min(1).nullable(),
  signature: z.string().trim().min(1).nullable(),
  telegramChatId: z.string().trim().min(1).nullable(),
  /** Set once an organization is archived (`POST /organizations/{id}/archive`,
   * 24/09/2026 — archiving, not deleting: a DELETE would wipe opt-out
   * history). `null` = active. */
  archivedAt: z.string().nullable(),
  /** Whether an ICP profile / a BANT grid is active (Beclose, 24/09/2026).
   * `null` = the backend build predates the field: unknown, NOT "missing". */
  icpActive: z.boolean().nullable().default(null),
  bantActive: z.boolean().nullable().default(null),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const clientListSchema = z.array(clientSummarySchema);
export type ClientSummary = z.infer<typeof clientSummarySchema>;
