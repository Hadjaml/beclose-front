import type { z } from "zod";
import type {
  handoffReasonSchema,
  leadProspectSchema,
  leadStatusSchema,
  qualificationResultSchema,
} from "../schemas/lead-prospect-schema";
import { icpFitLabels, type IcpFit } from "./icp-evaluation";

export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadProspect = z.infer<typeof leadProspectSchema>;
export type QualificationResult = z.infer<typeof qualificationResultSchema>;
export type HandoffReason = z.infer<typeof handoffReasonSchema>;
export type { IcpFit };
export { icpFitLabels };

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

export const qualificationResultLabels = {
  qualified: "Qualifié",
  nurture: "En maturation",
  not_qualified: "Non qualifié",
} as const satisfies Record<QualificationResult, string>;

export const handoffReasonLabels = {
  strong_need_signal: "Besoin fort détecté (transfert anticipé)",
  booking_calendar_not_connected: "Agenda non connecté",
  booking_no_availability: "Aucune disponibilité trouvée",
  booking_no_convergence: "Aucun créneau commun trouvé",
  booking_error: "Erreur technique lors de la prise de rendez-vous",
} as const satisfies Record<HandoffReason, string>;

/** The one distinction that actually matters for display: a deliberate
 * early handoff (product working as intended) vs. a booking-negotiation
 * failure — never render the five values flat with equal visual weight. */
export const handoffReasonKind = {
  strong_need_signal: "success",
  booking_calendar_not_connected: "failure",
  booking_no_availability: "failure",
  booking_no_convergence: "failure",
  booking_error: "failure",
} as const satisfies Record<HandoffReason, "success" | "failure">;
