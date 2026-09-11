import { z } from "zod";

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
  company: leadProspectCompanySchema,
  contact: leadProspectContactSchema,
});
