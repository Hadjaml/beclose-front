import type { z } from "zod";
import type {
  bantEvaluationSchema,
  customBantCriterionSchema,
  qualificationResultSchema,
  qualificationResultValues,
} from "../schemas/bant-evaluation-schema";

export type KnownQualificationResult = (typeof qualificationResultValues)[number];
export type QualificationResult = z.infer<typeof qualificationResultSchema>;
export type CustomBantCriterion = z.infer<typeof customBantCriterionSchema>;
export type BantEvaluation = z.infer<typeof bantEvaluationSchema>;

export const qualificationResultLabels = {
  qualified: "Qualifié",
  nurture: "En maturation",
  not_qualified: "Non qualifié",
} as const satisfies Record<KnownQualificationResult, string>;
