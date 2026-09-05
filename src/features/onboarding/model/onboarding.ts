import type { z } from "zod";
import { onboardingStepIdSchema } from "../schemas/onboarding-schemas";
import type {
  approachStepSchema,
  companyStepSchema,
  launchStepSchema,
  onboardingDraftSchema,
  onboardingStepStatusSchema,
  onboardingWizardSnapshotSchema,
  offerStepSchema,
  qualificationStepSchema,
  targetSegmentSchema,
  toolsStepSchema,
  trainingStepSchema,
} from "../schemas/onboarding-schemas";

export const onboardingStepIds = onboardingStepIdSchema.options;
export type OnboardingStepId = z.infer<typeof onboardingStepIdSchema>;
export type OnboardingStepStatus = z.infer<typeof onboardingStepStatusSchema>;

export type CompanyStepData = z.infer<typeof companyStepSchema>;
export type OfferStepData = z.infer<typeof offerStepSchema>;
export type TargetSegmentData = z.infer<typeof targetSegmentSchema>;
export type QualificationStepData = z.infer<typeof qualificationStepSchema>;
export type ApproachStepData = z.infer<typeof approachStepSchema>;
export type ToolsStepData = z.infer<typeof toolsStepSchema>;
export type TrainingStepData = z.infer<typeof trainingStepSchema>;
export type LaunchStepData = z.infer<typeof launchStepSchema>;

export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>;
export type OnboardingWizardSnapshot = z.infer<typeof onboardingWizardSnapshotSchema>;

export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  label: string;
  description: string;
}

export const onboardingSteps: readonly OnboardingStepDefinition[] = [
  { id: "company", label: "Entreprise", description: "Comprendre le client" },
  { id: "offer", label: "Offre", description: "Ce que Bewise doit aider à vendre" },
  { id: "target", label: "Cible", description: "Définir les entreprises à rechercher" },
  { id: "qualification", label: "Qualification", description: "Reconnaître une vraie opportunité" },
  { id: "approach", label: "Approche", description: "Adopter la bonne manière de communiquer" },
  { id: "tools", label: "Outils", description: "Choisir l’environnement de travail" },
  { id: "training", label: "Entraînement", description: "Préparer la validation humaine" },
  { id: "launch", label: "Lancement", description: "Vérifier avant de préparer" },
];
