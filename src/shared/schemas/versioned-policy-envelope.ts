import { z } from "zod";

/**
 * Shared shape for a versioned, append-only business policy scoped to one
 * organization — `icp_profiles` and `qualification_criteria` (BANT), per
 * the ICP/BANT target architecture (`reponse_techlead_icp_bant.md`,
 * section 3.1: "Structure commune aux deux"). Not a frontend invention:
 * the source document specifies this exact common shape for both tables.
 *
 * Not wired to any endpoint yet — Beclose hasn't built `icp_profiles` or
 * extended `qualification_criteria` with these fields. See
 * `.claude/skills/bewise-app/references/conventions.md` for status.
 */
export const policyStatusSchema = z.enum(["draft", "active", "archived"]);
export type PolicyStatus = z.infer<typeof policyStatusSchema>;

export function versionedPolicyEnvelopeSchema<T extends z.ZodTypeAny>(criteriaSchema: T) {
  return z.object({
    id: z.string().trim().min(1),
    organizationId: z.string().trim().min(1),
    name: z.string().trim().min(1),
    version: z.number().int().positive(),
    status: policyStatusSchema,
    criteria: criteriaSchema,
    supersedesId: z.string().trim().min(1).nullable(),
    createdAt: z.string(),
    activatedAt: z.string().nullable(),
    createdBy: z.string().trim().min(1).nullable(),
    notes: z.string().trim().min(1).nullable(),
  });
}
