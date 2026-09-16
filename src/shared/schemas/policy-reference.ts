import { z } from "zod";

/**
 * Lightweight reference to a versioned policy (`icp_profiles`/
 * `qualification_criteria`) used to evaluate a lead — `{id, name, version}`,
 * never a bare FK: lets a detail view render "evaluated with BANT grid v3"
 * without a separate round trip for the version number. Real shape, from
 * Beclose's `ProfileRefOut` (`api/routers/organizations.py`, ICP/BANT
 * wiring step 6a).
 */
export const policyReferenceSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  version: z.number().int().positive(),
});
