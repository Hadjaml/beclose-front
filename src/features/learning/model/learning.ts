import type { z } from "zod";
import type {
  autonomyStateSchema,
  humanDecisionSchema,
  humanValidationEventSchema,
  learningDomainSchema,
  learningDomainSnapshotSchema,
  learningOverviewSchema,
  proposedLearningRuleSchema,
} from "../schemas/learning-schemas";

export type LearningDomain = z.infer<typeof learningDomainSchema>;
export type AutonomyState = z.infer<typeof autonomyStateSchema>;
export type HumanDecision = z.infer<typeof humanDecisionSchema>;
export type HumanValidationEvent = z.infer<typeof humanValidationEventSchema>;
export type ProposedLearningRule = z.infer<typeof proposedLearningRuleSchema>;
export type LearningDomainSnapshot = z.infer<typeof learningDomainSnapshotSchema>;
export type LearningOverview = z.infer<typeof learningOverviewSchema>;

export const learningDomainLabels = {
  TARGETING: "Ciblage",
  SCORING: "Scoring",
  APPROACH_STRATEGY: "Stratégie d’approche",
  MESSAGES: "Messages",
  QUALIFICATION: "Qualification",
} as const satisfies Record<LearningDomain, string>;

export const autonomyStateLabels = {
  INITIAL_LEARNING: "Premiers apprentissages",
  SUPERVISED: "Supervision active",
  PARTIAL_AUTONOMY: "Autonomie partielle",
  STANDARD_CASE_AUTONOMY: "Autonome sur les cas standards",
} as const satisfies Record<AutonomyState, string>;
