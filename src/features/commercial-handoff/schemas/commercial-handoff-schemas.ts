import { z } from "zod";
import { progressiveQualificationSchema } from "@/features/conversations";
import {
  contactChannelSchema,
  prospectCompanySchema,
  prospectContactSchema,
  prospectScoreSchema,
  targetingDecisionSchema,
} from "@/features/prospecting";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const textList = z.array(z.string().trim().min(1)).optional();

export const commercialAssignmentStatusSchema = z.enum([
  "UNASSIGNED",
  "ASSIGNED",
  "ACKNOWLEDGED",
]);

export const commercialOwnerSchema = z.object({
  id: z.string().trim().min(1),
  displayName: optionalText,
  teamId: optionalText,
  teamName: optionalText,
});

export const commercialAssignmentSchema = z.object({
  status: commercialAssignmentStatusSchema,
  commercial: commercialOwnerSchema.optional(),
  assignedAt: z.string().datetime({ offset: true }).optional(),
  acknowledgedAt: z.string().datetime({ offset: true }).optional(),
});

export const commercialBriefSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  appointmentId: z.string().trim().min(1),
  prospectId: z.string().trim().min(1),
  conversationId: z.string().trim().min(1),
  identitySnapshot: z
    .object({
      company: prospectCompanySchema,
      contact: prospectContactSchema.optional(),
      usefulInformation: textList,
    })
    .optional(),
  targetingSnapshot: z
    .object({
      initialReason: optionalText,
      matchedIcpCriteria: textList,
      score: prospectScoreSchema.optional(),
      recommendation: targetingDecisionSchema.optional(),
    })
    .optional(),
  historySnapshot: z
    .object({
      channelsUsed: z.array(contactChannelSchema).optional(),
      outreachSummary: optionalText,
      conversationSummary: optionalText,
    })
    .optional(),
  needSnapshot: z
    .object({
      problemOrNeed: optionalText,
      expressedInterest: optionalText,
      context: optionalText,
    })
    .optional(),
  qualificationSnapshot: progressiveQualificationSchema.optional(),
  reservationsSnapshot: z
    .object({
      objections: textList,
      unresolvedQuestions: textList,
      blockers: textList,
    })
    .optional(),
  discoverySnapshot: z
    .object({
      missingInformation: textList,
      suggestedQuestions: textList,
    })
    .optional(),
  commercialAngle: z
    .object({
      angle: optionalText,
      rationale: optionalText,
    })
    .optional(),
  nextStep: z.object({
    assignment: commercialAssignmentSchema,
    objective: optionalText,
  }),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

export const commercialAssignmentActionSchema = z.object({
  workspaceId: workspaceIdSchema,
  appointmentId: z.string().trim().min(1),
  action: z.literal("ACKNOWLEDGE"),
});
