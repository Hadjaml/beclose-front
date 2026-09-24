import type { z } from "zod";
import type {
  handoffReasonSchema,
  handoffReasonValues,
  leadOutcomeSchema,
  leadOutcomeValues,
  leadProspectSchema,
  leadStatusSchema,
  leadStatusValues,
  qualificationResultSchema,
  qualificationResultValues,
} from "../schemas/lead-prospect-schema";
import {
  describeEnumValue,
  pickForEnumValue,
  type TolerantEnum,
} from "@/shared/schemas/tolerant-enum";
import { icpFitLabel, icpFitLabels, type IcpFit, type KnownIcpFit } from "./icp-evaluation";

/** Every status this frontend knows; the backend may send others. */
export type KnownLeadStatus = (typeof leadStatusValues)[number];
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadProspect = z.infer<typeof leadProspectSchema>;
export type KnownQualificationResult = (typeof qualificationResultValues)[number];
export type QualificationResult = z.infer<typeof qualificationResultSchema>;
export type KnownHandoffReason = (typeof handoffReasonValues)[number];
export type HandoffReason = z.infer<typeof handoffReasonSchema>;
/** What this frontend may *send* — a closed choice it decides itself. */
export type KnownLeadOutcome = (typeof leadOutcomeValues)[number];
/** What Beclose may *return* — open (tolerant). */
export type LeadOutcome = z.infer<typeof leadOutcomeSchema>;
export type { IcpFit, KnownIcpFit };
export { icpFitLabel, icpFitLabels };

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
} as const satisfies Record<KnownLeadStatus, string>;

/** Never throws on a status added by Beclose after this was written. */
export function leadStatusLabel(status: LeadStatus): string {
  return describeEnumValue(leadStatusLabels, status);
}

export const qualificationResultLabels = {
  qualified: "Qualifié",
  nurture: "En maturation",
  not_qualified: "Non qualifié",
} as const satisfies Record<KnownQualificationResult, string>;

export function qualificationResultLabel(result: QualificationResult): string {
  return describeEnumValue(qualificationResultLabels, result, "Résultat inconnu");
}

export const handoffReasonLabels = {
  strong_need_signal: "Besoin fort détecté (transfert anticipé)",
  booking_calendar_not_connected: "Agenda non connecté",
  booking_no_availability: "Aucune disponibilité trouvée",
  booking_no_convergence: "Aucun créneau commun trouvé",
  booking_error: "Erreur technique lors de la prise de rendez-vous",
} as const satisfies Record<KnownHandoffReason, string>;

export function handoffReasonLabel(reason: HandoffReason): string {
  return describeEnumValue(handoffReasonLabels, reason, "Motif inconnu");
}

/** The one distinction that actually matters for display: a deliberate
 * early handoff (product working as intended) vs. a booking-negotiation
 * failure — never render the five values flat with equal visual weight. */
const handoffReasonKinds = {
  strong_need_signal: "success",
  booking_calendar_not_connected: "failure",
  booking_no_availability: "failure",
  booking_no_convergence: "failure",
  booking_error: "failure",
} as const satisfies Record<KnownHandoffReason, "success" | "failure">;

/** A reason Beclose adds later is `"unknown"` — neither success nor failure:
 * a severity is never guessed from a value this frontend has never seen. */
export function handoffReasonKind(reason: HandoffReason): "success" | "failure" | "unknown" {
  return pickForEnumValue<KnownHandoffReason, "success" | "failure" | "unknown">(
    handoffReasonKinds,
    reason,
    "unknown",
  );
}

/** Text colour for a handoff reason: green / red, and a *neutral* grey for a
 * reason we do not know. */
export function handoffReasonToneClass(reason: HandoffReason): string {
  const kind = handoffReasonKind(reason);
  if (kind === "success") return "text-emerald-700";
  if (kind === "failure") return "text-red-700";
  return "text-text-secondary";
}

export const leadOutcomeLabels = {
  won: "Gagné",
  lost: "Perdu",
} as const satisfies Record<KnownLeadOutcome, string>;

export function leadOutcomeLabel(outcome: LeadOutcome): string {
  return describeEnumValue(leadOutcomeLabels, outcome, "Issue inconnue");
}

/** Statuses that count as "transmitted" to the client on Beclose's side
 * (`core.leads.TRANSMITTED_STATUSES`) — the only ones that can carry an
 * outcome; anything else is refused with a 409. Mirrors that list, so it is
 * the one place to update if Beclose changes it. */
const OUTCOME_ELIGIBLE_STATUSES: readonly TolerantEnum<KnownLeadStatus>[] = ["booked", "handed_off", "converted"];

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
}): readonly KnownLeadOutcome[] {
  if (!OUTCOME_ELIGIBLE_STATUSES.includes(lead.status)) return [];
  if (lead.outcome === "won") return [];
  // An outcome this frontend does not know: offer nothing rather than guess.
  if (lead.outcome !== null && lead.outcome !== "lost") return [];
  const actions: KnownLeadOutcome[] = ["won"];
  if (lead.outcome === null && lead.status !== "converted") actions.push("lost");
  return actions;
}
