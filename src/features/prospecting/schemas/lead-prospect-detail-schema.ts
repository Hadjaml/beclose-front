import { bantEvaluationSchema } from "@/features/conversations";
import { policyReferenceSchema } from "@/shared/schemas/policy-reference";
import { icpEvaluationSchema } from "./icp-evaluation-schema";
import { leadProspectSchema } from "./lead-prospect-schema";

/**
 * `GET /organizations/{id}/prospects/{leadId}` — added at ICP/BANT wiring
 * step 6a (didn't exist in the original v0 contract). Extends
 * `leadProspectSchema` with the two full evaluations and the exact policy
 * versions used.
 *
 * `icpEvaluation` is validated loosely (the target `icpEvaluationSchema`
 * itself is optional — confirmed with Beclose that no agent writes this
 * field yet, it is always `null` in practice today; only `.nullable()`
 * matters here, not shape validation of something that never arrives).
 * `qualificationEvaluation` uses the real, already-cross-validated
 * `bantEvaluationSchema` (conversations) — the BANT agent does write this.
 */
export const leadProspectDetailSchema = leadProspectSchema.extend({
  icpEvaluation: icpEvaluationSchema.nullable(),
  qualificationEvaluation: bantEvaluationSchema.nullable(),
  qualificationCriteria: policyReferenceSchema.nullable(),
  icpProfile: policyReferenceSchema.nullable(),
});
