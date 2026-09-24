import type { z } from "zod";
import type {
  handoffReasonSchema,
  leadOutcomeSchema,
  leadProspectSchema,
  leadStatusSchema,
  qualificationResultSchema,
} from "../schemas/lead-prospect-schema";
import { icpFitLabels, type IcpFit } from "./icp-evaluation";

export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadProspect = z.infer<typeof leadProspectSchema>;
export type QualificationResult = z.infer<typeof qualificationResultSchema>;
export type HandoffReason = z.infer<typeof handoffReasonSchema>;
export type LeadOutcome = z.infer<typeof leadOutcomeSchema>;
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

export const leadOutcomeLabels = {
  won: "Gagné",
  lost: "Perdu",
} as const satisfies Record<LeadOutcome, string>;

/** Statuses that count as "transmitted" to the client on Beclose's side
 * (`core.leads.TRANSMITTED_STATUSES`) — the only ones that can carry an
 * outcome; anything else is refused with a 409. Mirrors that list, so it is
 * the one place to update if Beclose changes it. */
const OUTCOME_ELIGIBLE_STATUSES: readonly LeadStatus[] = ["booked", "handed_off", "converted"];

/**
 * Which outcome actions to offer for a lead — Beclose's own rules
 * (`core.leads.record_outcome`), so the UI never offers what the API will
 * refuse:
 * - not transmitted → none;
 * - `won` is terminal (`converted`): `won → lost` is refused, nothing to offer;
 * - a `converted` lead can never be declared lost;
 * - `lost → won` is accepted (the client eventually signed).
 * Beclose stays the authority: a refusal is still handled if the state moved
 * since this was loaded.
 */
export function availableOutcomeActions(lead: {
  status: LeadStatus;
  outcome: LeadOutcome | null;
}): readonly LeadOutcome[] {
  if (!OUTCOME_ELIGIBLE_STATUSES.includes(lead.status)) return [];
  if (lead.outcome === "won") return [];
  const actions: LeadOutcome[] = ["won"];
  if (lead.outcome === null && lead.status !== "converted") actions.push("lost");
  return actions;
}
