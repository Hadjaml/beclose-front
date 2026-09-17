import { z } from "zod";
import { bantEvaluationSchema } from "@/features/conversations";
import { policyReferenceSchema } from "@/shared/schemas/policy-reference";
import { icpEvaluationSchema } from "./icp-evaluation-schema";
import { leadProspectSchema } from "./lead-prospect-schema";

const criterionEvidenceItemSchema = z.object({
  text: z.string().trim(),
  source_interaction_id: z.string().trim().optional(),
});

const evaluatedCriterionWireSchema = z.union([
  // Real Beclose wire shape: { status, evidence: [{ text, source_interaction_id }] }
  z
    .object({
      status: z.string(),
      evidence: z.array(criterionEvidenceItemSchema),
    })
    .transform((raw) => ({
      status: raw.status,
      evidence: raw.evidence[0]?.text,
      sourceInteractionId: raw.evidence[0]?.source_interaction_id,
    })),
  // Direct shape: { status, evidence?: string, sourceInteractionId?: string }
  z.object({
    status: z.string(),
    evidence: z.string().trim().min(1).optional(),
    sourceInteractionId: z.string().trim().min(1).optional(),
  }),
]);

export const leadQualificationEvaluationSchema = z.union([
  // Real Beclose wire shape from QualificationEvaluationRecord
  z
    .object({
      budget: evaluatedCriterionWireSchema,
      authority: evaluatedCriterionWireSchema,
      need: evaluatedCriterionWireSchema,
      timing: evaluatedCriterionWireSchema,
      schema_version: z.string().optional(),
      criteria_version: z.number().int().positive().optional(),
      evaluated_at: z.string().optional(),
      handoff_signals: z.record(z.string(), z.boolean()).optional(),
      qualificationCriteriaId: z.string().optional(),
      qualificationCriteriaVersion: z.number().int().positive().optional(),
      result: z.string().optional(),
    })
    .transform((raw) => ({
      budget: raw.budget,
      authority: raw.authority,
      need: raw.need,
      timing: raw.timing,
      ...(raw.qualificationCriteriaId !== undefined
        ? { qualificationCriteriaId: raw.qualificationCriteriaId }
        : {}),
      ...(raw.qualificationCriteriaVersion !== undefined
        ? { qualificationCriteriaVersion: raw.qualificationCriteriaVersion }
        : {}),
      ...(raw.result !== undefined ? { result: raw.result } : {}),
    })),
  // Legacy / design document shape
  bantEvaluationSchema,
]);

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
 * `qualificationEvaluation` accepts both Beclose's real wire shape
 * (CriterionEvaluation with evidence list) and the legacy design shape.
 */
export const leadProspectDetailSchema = leadProspectSchema.extend({
  icpEvaluation: icpEvaluationSchema.nullable(),
  qualificationEvaluation: leadQualificationEvaluationSchema.nullable(),
  qualificationCriteria: policyReferenceSchema.nullable(),
  icpProfile: policyReferenceSchema.nullable(),
});

