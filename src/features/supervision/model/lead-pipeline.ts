import type { z } from "zod";
import type { leadCountsSchema, workspaceLeadPipelineSchema } from "../schemas/lead-pipeline-schema";

export type LeadCounts = z.infer<typeof leadCountsSchema>;
export type WorkspaceLeadPipeline = z.infer<typeof workspaceLeadPipelineSchema>;

export const leadStatusLabels = {
  identified: "Identifiés",
  contacted: "Contactés",
  replied: "Ont répondu",
  qualified: "Qualifiés",
  booked: "RDV pris",
  converted: "Convertis",
  handed_off: "Transmis au CRM",
  opted_out: "Désinscrits",
  bounced: "E-mails rejetés",
  disqualified: "Disqualifiés",
} as const satisfies Record<keyof LeadCounts, string>;

/** Nominal pipeline path first, then the terminal/exit statuses. */
export const leadStatusDisplayOrder = [
  "identified",
  "contacted",
  "replied",
  "qualified",
  "booked",
  "converted",
  "handed_off",
  "opted_out",
  "bounced",
  "disqualified",
] as const satisfies readonly (keyof LeadCounts)[];
