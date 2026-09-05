import type { z } from "zod";
import type {
  commercialAssignmentActionSchema,
  commercialAssignmentSchema,
  commercialAssignmentStatusSchema,
  commercialBriefSchema,
  commercialOwnerSchema,
} from "../schemas/commercial-handoff-schemas";

export type CommercialAssignmentStatus = z.infer<typeof commercialAssignmentStatusSchema>;
export type CommercialOwner = z.infer<typeof commercialOwnerSchema>;
export type CommercialAssignment = z.infer<typeof commercialAssignmentSchema>;
export type CommercialBrief = z.infer<typeof commercialBriefSchema>;
export type CommercialAssignmentAction = z.infer<typeof commercialAssignmentActionSchema>;

export const commercialAssignmentStatusLabels = {
  UNASSIGNED: "Non assigné",
  ASSIGNED: "Assigné",
  ACKNOWLEDGED: "Pris en charge",
} as const satisfies Record<CommercialAssignmentStatus, string>;
