import { z } from "zod";
import { tolerantEnum } from "@/shared/schemas/tolerant-enum";

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

export const icpFitValues = ["strong", "moderate", "weak", "none"] as const;
/** Tolerant: Beclose owns this vocabulary and the per-lead ICP evaluation is
 * about to evolve it (`tolerantEnum`, transverse rule 24/09/2026). */
export const icpFitSchema = tolerantEnum(icpFitValues);
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

const evidenceWireSchema = z.object({
  text: z.string(),
  source_interaction_id: z.string().nullable().optional(),
});

const observedSignalWireSchema = z
  .object({ signal: z.string(), evidence: z.array(evidenceWireSchema).default([]) })
  .transform((raw) => ({
    signal: raw.signal,
    evidence: raw.evidence.map((item) => ({
      text: item.text,
      sourceInteractionId: item.source_interaction_id ?? null,
    })),
  }));

/**
 * The per-lead ICP evaluation Beclose writes once a prospect replies (B06,
 * 24/09/2026), snake_case as stored. The agent only OBSERVES signals with
 * cited evidence; the verdict comes from deterministic rules (provisional).
 * `verdict` and `verdict_basis` codes are Beclose's vocabulary: tolerant.
 * The verdict never changes the lead's status.
 */
export const icpEvaluationRecordSchema = z
  .object({
    profile_id: z.string().nullable().optional(),
    profile_version: z.number().int().nullable().optional(),
    evaluated_at: z.string().nullable().optional(),
    verdict: icpFitSchema,
    verdict_basis: z.array(z.string()).default([]),
    positive_signals: z.array(observedSignalWireSchema).default([]),
    negative_signals: z.array(observedSignalWireSchema).default([]),
    hard_disqualifiers: z.array(observedSignalWireSchema).default([]),
    commercial_maturity: z
      .object({ level: z.string(), evidence: z.array(evidenceWireSchema).default([]) })
      .nullable()
      .optional(),
  })
  .transform((raw) => ({
    /** Same value as `verdict`: every evaluation shape exposes `fit`. */
    fit: raw.verdict,
    verdict: raw.verdict,
    verdictBasis: raw.verdict_basis,
    profileId: raw.profile_id ?? null,
    profileVersion: raw.profile_version ?? null,
    evaluatedAt: raw.evaluated_at ?? null,
    positiveSignals: raw.positive_signals,
    negativeSignals: raw.negative_signals,
    hardDisqualifiers: raw.hard_disqualifiers,
    commercialMaturity:
      raw.commercial_maturity === null || raw.commercial_maturity === undefined
        ? null
        : {
            level: raw.commercial_maturity.level,
            evidence: raw.commercial_maturity.evidence.map((item) => ({
              text: item.text,
              sourceInteractionId: item.source_interaction_id ?? null,
            })),
          },
  }));

export const icpEvaluationSchema = z.union([
  icpEvaluationRecordSchema,
  icpEvaluationDocumentSchema,
  icpEvaluationWireSchema,
]);

