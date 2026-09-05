import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `Renseignez ${label}.`);
const optionalUrl = z.union([
  z.literal(""),
  z.url("Saisissez une adresse complète, par exemple https://entreprise.fr."),
]);
const optionalEmail = z.union([
  z.literal(""),
  z.email("Saisissez une adresse e-mail valide."),
]);

export const companyStepSchema = z.object({
  companyName: requiredText("le nom de l’entreprise"),
  website: optionalUrl,
  industry: requiredText("le secteur ou l’activité"),
  description: requiredText("une courte description"),
  primaryMarket: z.string().trim(),
  companySize: z.string().trim(),
  primaryContactName: requiredText("le nom de l’interlocuteur principal"),
  primaryContactEmail: optionalEmail,
});

export const offerStepSchema = z.object({
  offerName: requiredText("le nom de l’offre"),
  description: requiredText("la description de l’offre"),
  valueProposition: requiredText("la proposition de valeur"),
  problemSolved: requiredText("le problème résolu"),
  targetCustomer: requiredText("la cible de cette offre"),
  priceRange: z.string().trim(),
  evidence: z.string().trim(),
  salesNotes: z.string().trim(),
});

export const targetSegmentSchema = z.object({
  name: z.string().trim(),
  industries: requiredText("les secteurs recherchés"),
  companySizes: z.string().trim(),
  geographies: requiredText("la géographie ciblée"),
  companyTypes: z.string().trim(),
  decisionMakers: requiredText("les fonctions recherchées"),
  requiredCriteria: requiredText("au moins un critère indispensable"),
  preferredCriteria: z.string().trim(),
  exclusions: requiredText("les exclusions, ou indiquez qu’il n’y en a pas"),
});

export const qualificationStepSchema = z.object({
  budget: z.string().trim(),
  authority: z.string().trim(),
  need: z.string().trim(),
  timing: z.string().trim(),
  determiningCriteria: requiredText("les critères réellement déterminants"),
  positiveSignals: requiredText("les signaux positifs"),
  exclusionSignals: requiredText("les signaux d’exclusion"),
});

export const approachStepSchema = z.object({
  tone: requiredText("le ton souhaité"),
  formality: z
    .enum(["", "casual", "balanced", "formal"])
    .refine((value) => value.length > 0, {
      error: "Choisissez un niveau de formalité.",
    }),
  positioning: requiredText("le positionnement"),
  keyArguments: requiredText("les arguments clés"),
  evidence: z.string().trim(),
  knownObjections: z.string().trim(),
  possibleAnswers: z.string().trim(),
  forbiddenTopics: requiredText("ce qui ne doit jamais être dit"),
  preferredCta: requiredText("l’action à proposer"),
  examples: z.string().trim(),
});

export const toolsStepSchema = z.object({
  operatingMode: z
    .enum(["", "client_tools", "bewise_portal"])
    .refine((value) => value.length > 0, {
      error: "Choisissez comment le client travaillera avec Bewise.",
    }),
});

export const trainingStepSchema = z.object({
  principleAcknowledged: z.boolean().refine((value) => value, {
    error: "Confirmez que le principe de validation progressive est compris.",
  }),
});

export const launchStepSchema = z.object({
  readyForPreparation: z.boolean().refine((value) => value),
});

export const onboardingStepIdSchema = z.enum([
  "company",
  "offer",
  "target",
  "qualification",
  "approach",
  "tools",
  "training",
  "launch",
]);

export const onboardingStepStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "BLOCKED",
]);

export const onboardingDraftSchema = z.object({
  company: companyStepSchema,
  offer: offerStepSchema,
  target: targetSegmentSchema,
  qualification: qualificationStepSchema,
  approach: approachStepSchema,
  tools: toolsStepSchema,
  training: trainingStepSchema,
  launch: launchStepSchema,
});

export const onboardingWizardSnapshotSchema = z.object({
  currentStep: onboardingStepIdSchema,
  draft: onboardingDraftSchema,
  statuses: z.record(onboardingStepIdSchema, onboardingStepStatusSchema),
});
