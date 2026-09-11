import type { z } from "zod";
import type { leadProspectSchema, leadStatusSchema } from "../schemas/lead-prospect-schema";

export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadProspect = z.infer<typeof leadProspectSchema>;

export const leadStatusLabels = {
  identified: "Identifié",
  contacted: "Contacté",
  replied: "A répondu",
  qualified: "Qualifié",
  booked: "RDV pris",
  converted: "Converti",
  handed_off: "Transmis au CRM",
  opted_out: "Désinscrit",
  bounced: "E-mail rejeté",
  disqualified: "Disqualifié",
} as const satisfies Record<LeadStatus, string>;
