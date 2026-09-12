import type { z } from "zod";
import type {
  authorityStatusSchema,
  bantCriteriaSchema,
  bantCriteriaVersionSchema,
  budgetStatusSchema,
  needStatusSchema,
  timingStatusSchema,
} from "../schemas/bant-criteria-schema";

export type BudgetStatus = z.infer<typeof budgetStatusSchema>;
export type AuthorityStatus = z.infer<typeof authorityStatusSchema>;
export type NeedStatus = z.infer<typeof needStatusSchema>;
export type TimingStatus = z.infer<typeof timingStatusSchema>;
export type BantCriteria = z.infer<typeof bantCriteriaSchema>;
export type BantCriteriaVersion = z.infer<typeof bantCriteriaVersionSchema>;

export const budgetStatusLabels = {
  validated: "Validé",
  probable: "Probable",
  unknown: "Inconnu",
  insufficient: "Insuffisant",
} as const satisfies Record<z.infer<typeof budgetStatusSchema>, string>;

export const authorityStatusLabels = {
  decision_maker: "Décideur",
  champion: "Champion",
  influencer: "Influenceur",
  unknown: "Inconnu",
  no_authority: "Aucune autorité",
} as const satisfies Record<z.infer<typeof authorityStatusSchema>, string>;

export const needStatusLabels = {
  strong: "Fort",
  moderate: "Modéré",
  weak: "Faible",
  none: "Aucun",
} as const satisfies Record<z.infer<typeof needStatusSchema>, string>;

export const timingStatusLabels = {
  "0_90_days": "0–90 jours",
  "3_6_months": "3–6 mois",
  over_6_months: "Plus de 6 mois",
  unknown: "Inconnu",
} as const satisfies Record<z.infer<typeof timingStatusSchema>, string>;
