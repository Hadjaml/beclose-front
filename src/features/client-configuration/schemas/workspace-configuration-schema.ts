import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";
import { bantCriteriaWireSchema } from "./bant-criteria-wire-schema";
import { icpCriteriaWireSchema } from "./icp-criteria-wire-schema";

/**
 * Matches Beclose's real `/organizations/{id}/configuration`
 * (`ConfigurationOut`, `api/routers/organizations.py`). Deliberately
 * separate from `clientConfigurationSchema` (`client-configuration-schema.ts`,
 * reuses the onboarding wizard's rich company/offer/target/qualification/
 * approach/tools sections) — Beclose stores none of that structure. It only
 * has `pitch`/`signature` as free text; `criteria` itself is JSONB with no
 * fixed SQL columns ("une structure fixe serait un pari prématuré" per
 * Beclose's own model docstring), but its *content* is validated on write
 * by Beclose's own Pydantic models — `bantCriteriaWireSchema`/
 * `icpCriteriaWireSchema` mirror that real, already-enforced shape (see
 * `bant-criteria-wire-schema.ts`/`icp-criteria-wire-schema.ts`) rather than
 * treating it as an opaque blob.
 */
export const qualificationCriteriaVersionSchema = z.object({
  version: z.number().int().positive(),
  criteria: bantCriteriaWireSchema,
  createdAt: z.string(),
});

/** Added 2026-09-16 (ICP/BANT wiring step 6a) — `IcpProfileOut` has no `id`
 * (unlike `qualification_criteria`'s counterpart), only what a config page
 * needs to display. */
export const icpProfileVersionSchema = z.object({
  name: z.string().trim().min(1),
  version: z.number().int().positive(),
  criteria: icpCriteriaWireSchema,
  createdAt: z.string(),
});

export const workspaceConfigurationSchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1),
  pitch: z.string().trim().min(1).nullable(),
  signature: z.string().trim().min(1).nullable(),
  telegramChatId: z.string().trim().min(1).nullable(),
  qualificationCriteria: qualificationCriteriaVersionSchema.nullable(),
  icpProfile: icpProfileVersionSchema.nullable(),
  /** Beclose's own verdict for a default sourcing run; `null` when the
   * backend build predates it. */
  sourcingReadiness: z.object({ ready: z.boolean(), blockers: z.array(z.string()) }).nullable(),
});
