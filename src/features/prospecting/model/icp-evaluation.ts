import type { z } from "zod";
import type { icpEvaluationSchema, icpFitSchema } from "../schemas/icp-evaluation-schema";

export type IcpFit = z.infer<typeof icpFitSchema>;
export type IcpEvaluation = z.infer<typeof icpEvaluationSchema>;

export const icpFitLabels = {
  strong: "Fort",
  moderate: "Modéré",
  weak: "Faible",
  none: "Aucun",
} as const satisfies Record<IcpFit, string>;
