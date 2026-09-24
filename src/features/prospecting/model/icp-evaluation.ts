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

export const icpVerdictBasisLabels = {
  hard_disqualifier: "Un critère éliminatoire de l’ICP a été observé.",
  excluded_maturity: "La maturité commerciale observée est exclue par l’ICP.",
  no_evidence: "Aucune preuve exploitable dans la conversation.",
  negative_outweighs_positive: "Les signaux négatifs l’emportent sur les signaux positifs.",
  maturity_outside_target: "La maturité commerciale observée est hors de la cible de l’ICP.",
  preferred_maturity_no_negative_signal: "Maturité préférée et aucun signal négatif.",
  partial_evidence: "Preuves partielles : le verdict reste prudent.",
} as const;

/** A basis code Beclose adds later is stated as unknown, never guessed. */
export function icpVerdictBasisLabel(code: string): string {
  return Object.hasOwn(icpVerdictBasisLabels, code)
    ? icpVerdictBasisLabels[code as keyof typeof icpVerdictBasisLabels]
    : `Motif inconnu : ${code}`;
}
