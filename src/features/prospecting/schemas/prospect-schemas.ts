import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();

export const targetingDecisionSchema = z.enum(["CONTACT", "VERIFY", "EXCLUDE"]);

export const exclusionTypeSchema = z.enum(["TEMPORARY", "PERMANENT"]);

export const prospectStatusSchema = z.enum([
  "DISCOVERED",
  "UNDER_REVIEW",
  "READY_TO_CONTACT",
  "OUTREACH_IN_PROGRESS",
  "REPLIED",
  "QUALIFIED",
  "ARCHIVED",
]);

export const contactChannelSchema = z.enum([
  "EMAIL",
  "LINKEDIN",
  "PHONE",
  "INSTAGRAM",
  "OTHER",
]);

export const strategyValidationStatusSchema = z.enum([
  "NOT_REVIEWED",
  "APPROVED",
  "CHANGES_REQUESTED",
]);

export const prospectCompanySchema = z.object({
  id: optionalText,
  name: z.string().trim().min(1),
  website: z.url().optional(),
  industry: optionalText,
  location: optionalText,
  size: optionalText,
});

export const prospectContactSchema = z.object({
  id: optionalText,
  firstName: optionalText,
  lastName: optionalText,
  fullName: optionalText,
  role: optionalText,
  email: z.email().optional(),
  linkedInUrl: z.url().optional(),
});

export const prospectScoreSchema = z.object({
  value: z.number(),
  label: optionalText,
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  reasons: z.array(z.string().trim().min(1)).optional(),
  matchedCriteria: z.array(z.string().trim().min(1)).optional(),
  uncertainties: z.array(z.string().trim().min(1)).optional(),
});

export const contactStrategySchema = z.object({
  recommendedChannel: contactChannelSchema.optional(),
  channelOrder: z.array(contactChannelSchema).optional(),
  angle: optionalText,
  rationale: optionalText,
  validationStatus: strategyValidationStatusSchema,
});

export const priorExclusionSchema = z.object({
  type: exclusionTypeSchema,
  reasonCode: z.string().trim().min(1),
  reasonLabel: optionalText,
  comment: optionalText,
  occurredAt: z.string().datetime({ offset: true }).optional(),
});

export const prospectHistoryEntrySchema = z.object({
  id: optionalText,
  label: z.string().trim().min(1),
  description: optionalText,
  occurredAt: z.string().datetime({ offset: true }).optional(),
});

export const prospectSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  company: prospectCompanySchema,
  contact: prospectContactSchema.optional(),
  score: prospectScoreSchema.optional(),
  recommendation: targetingDecisionSchema.optional(),
  status: prospectStatusSchema,
  alreadyKnown: z.boolean().optional(),
  priorExclusion: priorExclusionSchema.optional(),
  history: z.array(prospectHistoryEntrySchema).optional(),
  contactStrategy: contactStrategySchema.optional(),
});

export const prospectListSchema = z.array(prospectSchema);
