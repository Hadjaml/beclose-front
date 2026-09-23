import { z } from "zod";

/**
 * Target per-lead ICP evaluation contract — HOW WELL a lead matches the
 * ICP version used to source it. New, separate schema: does not replace
 * `prospectSchema.recommendation` (an action: CONTACT/VERIFY/EXCLUDE) or
 * `prospectSchema.score` (a numeric value) — per
 * `reponse_techlead_icp_bant.md` decision C, `fit` (a property) and
 * `recommendation` (an action) answer different questions and coexist.
 * Decision D: qualitative only in V0, no numeric score — a score from an
 * uncalibrated LLM would be false precision; may be derived later once
 * closed-won data exists to calibrate it.
 *
 * NOT WIRED: no backend field exists for any of this yet (brique 3
 * unbuilt). Types/schemas only.
 */

export const icpFitSchema = z.enum(["strong", "moderate", "weak", "none"]);
export type IcpFit = z.infer<typeof icpFitSchema>;

/**
 * Real Beclose wire shape written by sourcing/qualification:
 * { fit: "strong", tier?: 1, sector?: "building_maintenance", reasons?: ["..."] }
 */
export const icpEvaluationWireSchema = z.object({
  fit: icpFitSchema,
  tier: z.number().int().nullable().optional(),
  sector: z.string().trim().nullable().optional(),
  reasons: z.array(z.string().trim()).nullable().optional(),
});

/**
 * Document / legacy shape from bewise_beclose_icp_bant_handoff.md §24
 */
export const icpEvaluationDocumentSchema = z.object({
  icpProfileId: z.string().trim().min(1),
  fit: icpFitSchema,
  evidence: z.record(z.string(), z.string().trim().min(1)),
  positiveSignals: z.array(z.string().trim().min(1)),
  negativeSignals: z.array(z.string().trim().min(1)),
  reasoningSummary: z.string().trim().min(1).max(500),
});

export const icpEvaluationSchema = z.union([
  icpEvaluationDocumentSchema,
  icpEvaluationWireSchema,
]);

