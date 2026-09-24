import { z } from "zod";
import { tolerantEnum } from "@/shared/schemas/tolerant-enum";
import { icpFitSchema } from "./icp-evaluation-schema";

/**
 * Matches Beclose's real `/organizations/{id}/prospects` (`ProspectOut`,
 * `api/routers/organizations.py`) — a lead joined with its company and
 * contact. Deliberately separate from `prospectSchema`
 * (`prospect-schemas.ts`): that one models a future targeting/contact-
 * strategy review workflow with no backend counterpart yet (no mutation
 * endpoints exist, `status` there is `ProspectStatus`, which has no mapping
 * to `LeadStatus` — reconciling the two is an open cross-repo question, not
 * something to decide here). `status` below stays `LeadStatus`, pass-through,
 * per the contract.
 */
export const leadStatusValues = [
  "identified",
  "contacted",
  "replied",
  "qualified",
  "booked",
  "converted",
  "opted_out",
  "bounced",
  "disqualified",
  "handed_off",
] as const;

/** Tolerant: Beclose owns this vocabulary (`core/state_machine.LeadStatus`)
 * and may add a status — an unknown one must not fail the whole prospects
 * list or a prospect page (`tolerantEnum`, transverse rule 24/09/2026). */
export const leadStatusSchema = tolerantEnum(leadStatusValues);

const nullableTimestamp = z.string().nullable();

export const leadProspectCompanySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  siren: z.string().trim().min(1).nullable(),
  sector: z.string().trim().min(1).nullable(),
  headcount: z.number().int().nonnegative().nullable(),
  source: z.string().trim().min(1),
});

export const leadProspectContactSchema = z.object({
  id: z.string().trim().min(1),
  fullName: z.string().trim().min(1).nullable(),
  email: z.email(),
  role: z.string().trim().min(1).nullable(),
  linkedinUrl: z.url().nullable(),
  source: z.string().trim().min(1).nullable(),
});

/**
 * `qualificationResult`/`icpFit`/`handoffReason`/`nurtureFollowUpsSent`
 * added 2026-09-16 (ICP/BANT wiring step 6a) — real fields now, verified
 * against `core/models/lead.py` before writing this, not guessed from a
 * relayed description. `icpFit` is always `null` in practice today: no
 * agent writes it yet (confirmed by Beclose, not a bug) — display it as
 * "not evaluated", not a rich per-value breakdown, per the coordination's
 * own instruction not to build UI around a field that stays empty.
 */
export const qualificationResultValues = ["qualified", "nurture", "not_qualified"] as const;
/** Tolerant like every backend-owned vocabulary (`tolerantEnum`, transverse
 * rule 24/09/2026) — it sits on every row of the prospects list. */
export const qualificationResultSchema = tolerantEnum(qualificationResultValues);

/** `strong_need_signal` is a deliberate early handoff (EF-403b, the product
 * working as intended); the other four are booking-negotiation failures.
 * Distinguishing the two is the whole point of this field — a broken
 * calendar integration must never look like a normal handoff. */
export const handoffReasonValues = [
  "strong_need_signal",
  "booking_calendar_not_connected",
  "booking_no_availability",
  "booking_no_convergence",
  "booking_error",
] as const;
/** Tolerant: disqualification/opt-out are about to add reasons. */
export const handoffReasonSchema = tolerantEnum(handoffReasonValues);

/** Commercial outcome of a *transmitted* lead, declared by hand (Beclose
 * `PUT .../prospects/{leadId}/outcome`, 24/09/2026 — the CRM webhook that
 * would send it automatically does not exist). Additive on `/prospects` and
 * `/prospects/{leadId}`: `null` until declared, and for every lead that was
 * never transmitted. */
export const leadOutcomeValues = ["won", "lost"] as const;
/** What Beclose *returns* is tolerant; what this frontend *sends*
 * (`KnownLeadOutcome`) stays a closed choice — it decides that one itself. */
export const leadOutcomeSchema = tolerantEnum(leadOutcomeValues);

export const leadProspectSchema = z.object({
  leadId: z.string().trim().min(1),
  status: leadStatusSchema,
  score: z.number().nullable(),
  sourceLayer: z.string().trim().min(1),
  identifiedAt: nullableTimestamp,
  contactedAt: nullableTimestamp,
  repliedAt: nullableTimestamp,
  qualifiedAt: nullableTimestamp,
  bookedAt: nullableTimestamp,
  convertedAt: nullableTimestamp,
  optedOutAt: nullableTimestamp,
  bouncedAt: nullableTimestamp,
  disqualifiedAt: nullableTimestamp,
  handedOffAt: nullableTimestamp,
  qualificationResult: qualificationResultSchema.nullable(),
  icpFit: icpFitSchema.nullable(),
  handoffReason: handoffReasonSchema.nullable(),
  nurtureFollowUpsSent: z.number().int().nonnegative(),
  // Tolerant: absent on a Beclose build that predates outcomes.
  outcome: leadOutcomeSchema.nullable().default(null),
  outcomeAt: z.string().nullable().default(null),
  company: leadProspectCompanySchema,
  contact: leadProspectContactSchema,
});
