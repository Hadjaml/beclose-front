import type { z } from "zod";
import { describeEnumValue } from "@/shared/schemas/tolerant-enum";
import type { icpEvaluationSchema, icpFitSchema, icpFitValues } from "../schemas/icp-evaluation-schema";

export type KnownIcpFit = (typeof icpFitValues)[number];
export type IcpFit = z.infer<typeof icpFitSchema>;
export type IcpEvaluation = z.infer<typeof icpEvaluationSchema>;

export const icpFitLabels = {
  strong: "Fort",
  moderate: "Modéré",
  weak: "Faible",
  none: "Aucun",
} as const satisfies Record<KnownIcpFit, string>;

/** Never throws on a fit value Beclose adds later. */
export function icpFitLabel(fit: IcpFit): string {
  return describeEnumValue(icpFitLabels, fit, "Adéquation inconnue");
}
