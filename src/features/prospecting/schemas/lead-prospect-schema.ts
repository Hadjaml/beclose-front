import { z } from "zod";
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
export const leadStatusSchema = z.enum([
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
]);

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
export const qualificationResultSchema = z.enum(["qualified", "nurture", "not_qualified"]);

/** `strong_need_signal` is a deliberate early handoff (EF-403b, the product
 * working as intended); the other four are booking-negotiation failures.
 * Distinguishing the two is the whole point of this field — a broken
 * calendar integration must never look like a normal handoff. */
export const handoffReasonSchema = z.enum([
  "strong_need_signal",
  "booking_calendar_not_connected",
  "booking_no_availability",
  "booking_no_convergence",
  "booking_error",
]);

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
  company: leadProspectCompanySchema,
  contact: leadProspectContactSchema,
});
