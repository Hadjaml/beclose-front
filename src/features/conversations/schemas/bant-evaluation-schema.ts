import { z } from "zod";
import {
  authorityStatusSchema,
  budgetStatusSchema,
  needStatusSchema,
  timingStatusSchema,
} from "@/features/client-configuration";

/**
 * Target per-lead BANT evaluation contract — the actual verdict of a
 * qualification conversation. Deliberately separate from
 * `progressiveQualificationSchema` (`conversation-schemas.ts`): that one is
 * already wired into a real component (`qualification-panel.tsx`) and a
 * real consumer (`commercial-handoff-schemas.ts`), and its generic
 * `KNOWN/UNKNOWN/TO_CONFIRM` status can't be swapped in place without also
 * updating those - out of scope for this step (types/schemas only, no
 * component work).
 *
 * Per `reponse_techlead_icp_bant.md` §4 decision E and the source
 * document's own per-criterion status proposal: `progressiveQualification`
 * survives almost as-is as the eventual target, this schema is what its
 * migration would produce. `customCriteria` (a real capability the
 * frontend already has, ahead of the source document) carries over
 * unchanged - the four BANT criteria stay the mandatory baseline, custom
 * criteria are the sanctioned extension.
 *
 * NOT WIRED: `qualification_criteria` (evaluation storage) doesn't exist
 * on `leads` yet. Types/schemas only.
 */

export const qualificationResultSchema = z.enum(["qualified", "nurture", "not_qualified"]);
export type QualificationResult = z.infer<typeof qualificationResultSchema>;

const optionalText = z.string().trim().min(1).optional();

function evaluatedCriterionSchema<T extends z.ZodTypeAny>(statusSchema: T) {
  return z.object({ status: statusSchema, evidence: optionalText });
}

/** Same shape as `qualificationCriterionSchema` (conversation-schemas.ts)
 * for a custom, per-organization criterion beyond the fixed four - kept
 * generic (no document-specified status vocabulary exists for these). */
export const customBantCriterionSchema = z.object({
  id: optionalText,
  label: z.string().trim().min(1),
  state: z.enum(["KNOWN", "UNKNOWN", "TO_CONFIRM"]),
  information: optionalText,
});

export const bantEvaluationSchema = z.object({
  criteriaVersion: z.number().int().positive(),
  budget: evaluatedCriterionSchema(budgetStatusSchema),
  authority: evaluatedCriterionSchema(authorityStatusSchema),
  need: evaluatedCriterionSchema(needStatusSchema),
  timing: evaluatedCriterionSchema(timingStatusSchema),
  customCriteria: z.array(customBantCriterionSchema).optional(),
  result: qualificationResultSchema,
});
