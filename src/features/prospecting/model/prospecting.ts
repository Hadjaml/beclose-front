import type { z } from "zod";
import type {
  contactChannelSchema,
  contactStrategySchema,
  exclusionTypeSchema,
  priorExclusionSchema,
  prospectCompanySchema,
  prospectContactSchema,
  prospectHistoryEntrySchema,
  prospectSchema,
  prospectScoreSchema,
  prospectStatusSchema,
  strategyValidationStatusSchema,
  targetingDecisionSchema,
} from "../schemas/prospect-schemas";
import type {
  contactStrategyReviewSchema,
  exclusionDraftSchema,
  targetingReviewSchema,
} from "../schemas/review-schemas";

export type TargetingDecision = z.infer<typeof targetingDecisionSchema>;
export type ExclusionType = z.infer<typeof exclusionTypeSchema>;
export type ProspectStatus = z.infer<typeof prospectStatusSchema>;
export type ContactChannel = z.infer<typeof contactChannelSchema>;
export type StrategyValidationStatus = z.infer<typeof strategyValidationStatusSchema>;
export type ProspectCompany = z.infer<typeof prospectCompanySchema>;
export type ProspectContact = z.infer<typeof prospectContactSchema>;
export type ProspectScore = z.infer<typeof prospectScoreSchema>;
export type ContactStrategy = z.infer<typeof contactStrategySchema>;
export type PriorExclusion = z.infer<typeof priorExclusionSchema>;
export type ProspectHistoryEntry = z.infer<typeof prospectHistoryEntrySchema>;
export type Prospect = z.infer<typeof prospectSchema>;
export type ExclusionDraft = z.infer<typeof exclusionDraftSchema>;
export type TargetingReview = z.infer<typeof targetingReviewSchema>;
export type ContactStrategyReview = z.infer<typeof contactStrategyReviewSchema>;

export const targetingDecisionLabels = {
  CONTACT: "À contacter",
  VERIFY: "À vérifier",
  EXCLUDE: "À exclure",
} as const satisfies Record<TargetingDecision, string>;

export const exclusionTypeLabels = {
  TEMPORARY: "Temporaire",
  PERMANENT: "Définitive",
} as const satisfies Record<ExclusionType, string>;

export const prospectStatusLabels = {
  DISCOVERED: "Découvert",
  UNDER_REVIEW: "À examiner",
  READY_TO_CONTACT: "Prêt à contacter",
  OUTREACH_IN_PROGRESS: "Prise de contact en cours",
  REPLIED: "A répondu",
  QUALIFIED: "Qualifié",
  ARCHIVED: "Archivé",
} as const satisfies Record<ProspectStatus, string>;

export const contactChannelLabels = {
  EMAIL: "E-mail",
  LINKEDIN: "LinkedIn",
  PHONE: "Téléphone",
  INSTAGRAM: "Instagram",
  OTHER: "Autre",
} as const satisfies Record<ContactChannel, string>;

export const strategyValidationStatusLabels = {
  NOT_REVIEWED: "À valider",
  APPROVED: "Validée",
  CHANGES_REQUESTED: "À ajuster",
} as const satisfies Record<StrategyValidationStatus, string>;
