import type { z } from "zod";
import type {
  activityEventSchema,
  globalSupervisionSchema,
  requiredActionSchema,
  requiredActionTypeSchema,
  supervisionPrioritySchema,
  systemResultSummarySchema,
  systemStatusSchema,
  workspaceSupervisionSchema,
  workspaceSupervisionSummarySchema,
} from "../schemas/supervision-schemas";

export type SystemStatus = z.infer<typeof systemStatusSchema>;
export type SupervisionPriority = z.infer<typeof supervisionPrioritySchema>;
export type RequiredActionType = z.infer<typeof requiredActionTypeSchema>;
export type RequiredAction = z.infer<typeof requiredActionSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type WorkspaceSupervisionSummary = z.infer<typeof workspaceSupervisionSummarySchema>;
export type SystemResultSummary = z.infer<typeof systemResultSummarySchema>;
export type WorkspaceSupervision = z.infer<typeof workspaceSupervisionSchema>;
export type GlobalSupervision = z.infer<typeof globalSupervisionSchema>;

export const systemStatusLabels = {
  ONBOARDING: "Onboarding",
  LEARNING: "En apprentissage",
  ACTIVE: "Système actif",
  NEEDS_ATTENTION: "Attention nécessaire",
  PAUSED: "En pause",
  ERROR: "Erreur",
} as const satisfies Record<SystemStatus, string>;

export const supervisionPriorityLabels = {
  LOW: "Faible",
  MEDIUM: "Normale",
  HIGH: "Élevée",
  URGENT: "Urgente",
} as const satisfies Record<SupervisionPriority, string>;
