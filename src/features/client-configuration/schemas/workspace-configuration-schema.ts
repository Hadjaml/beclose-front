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

/** What the sourcing applies from the ICP's geography. `status` stays a
 * plain string: Beclose owns the vocabulary and an unknown one is shown as
 * unknown (`describeGeographyScope`), never failing the configuration. */
export const geographyScopeSchema = z.object({
  status: z.string(),
  regions: z.array(z.string()).default([]),
  departements: z.array(z.string()).default([]),
  unrecognized: z.array(z.string()).default([]),
});

/** Beclose's verdict for a default sourcing run; `null` when its build
 * predates it. `geography` is `null` without a valid active ICP profile. */
export const sourcingReadinessSchema = z.object({
  ready: z.boolean(),
  blockers: z.array(z.string()),
  geography: geographyScopeSchema.nullable().default(null),
});

export const workspaceConfigurationSchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1),
  pitch: z.string().trim().min(1).nullable(),
  signature: z.string().trim().min(1).nullable(),
  telegramChatId: z.string().trim().min(1).nullable(),
  qualificationCriteria: qualificationCriteriaVersionSchema.nullable(),
  icpProfile: icpProfileVersionSchema.nullable(),
  sourcingReadiness: sourcingReadinessSchema.nullable(),
});
