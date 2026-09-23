import { z } from "zod";
import { policyStatusSchema } from "@/shared/schemas/versioned-policy-envelope";

/**
 * Shared response shape of `POST /organizations/{id}/icp-profile` and
 * `POST /organizations/{id}/bant-criteria` (`IcpProfileVersionOut` /
 * `QualificationCriteriaVersionOut`, `api/routers/organizations.py`,
 * EF-601/602, 2026-09-23) — deliberately light (identity + version
 * metadata only): the frontend already has the content it just submitted,
 * no need for Beclose to echo it back.
 */
export const policyVersionSummarySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  version: z.number().int().positive(),
  status: policyStatusSchema,
  activatedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type PolicyVersionSummary = z.infer<typeof policyVersionSummarySchema>;
