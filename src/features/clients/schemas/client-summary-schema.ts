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
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const clientListSchema = z.array(clientSummarySchema);
export type ClientSummary = z.infer<typeof clientSummarySchema>;
