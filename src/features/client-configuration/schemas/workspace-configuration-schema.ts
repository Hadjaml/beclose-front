import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

/**
 * Matches Beclose's real `/organizations/{id}/configuration`
 * (`ConfigurationOut`, `api/routers/organizations.py`). Deliberately
 * separate from `clientConfigurationSchema` (`client-configuration-schema.ts`,
 * reuses the onboarding wizard's rich company/offer/target/qualification/
 * approach/tools sections) — Beclose stores none of that structure. It only
 * has `pitch`/`signature` as free text and `qualification_criteria.criteria`
 * as an intentionally unstructured JSONB blob (no fixed BANT columns, "une
 * structure fixe serait un pari prématuré" per Beclose's own model
 * docstring) — there is no honest way to split either into the wizard's
 * many typed fields.
 */
export const qualificationCriteriaVersionSchema = z.object({
  version: z.number().int().positive(),
  criteria: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
});

export const workspaceConfigurationSchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1),
  pitch: z.string().trim().min(1).nullable(),
  signature: z.string().trim().min(1).nullable(),
  telegramChatId: z.string().trim().min(1).nullable(),
  qualificationCriteria: qualificationCriteriaVersionSchema.nullable(),
});
