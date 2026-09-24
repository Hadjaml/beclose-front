import { z } from "zod";
import { tolerantEnum } from "@/shared/schemas/tolerant-enum";

/**
 * Matches Beclose's real `/organizations/{id}/messages`
 * (`MessageOut`, `api/routers/organizations.py`) — the raw, append-only
 * `interactions` audit log (EF-705), read-only. Approving/rejecting a
 * pending message stays Telegram-only, never duplicated here (per the
 * contract). `status` is `null` for every `INBOUND` row by design (only
 * outbound messages go through an approval cycle) — not an anomaly.
 */
export const interactionDirectionSchema = z.enum(["outbound", "inbound"]);

export const interactionStatusValues = [
  "pending_approval",
  "approved",
  "rejected",
  "sent",
  "superseded",
  // System cancellation of a pending follow-up when the lead opts out or is
  // disqualified (Beclose, 24/09/2026) — distinct from `rejected`, a human
  // decision. Without it a single such message fails the whole list.
  "cancelled",
] as const;

/** Tolerant: Beclose owns this vocabulary and has already extended it once
 * (`cancelled`, 24/09/2026) — an unknown status must not fail the whole
 * messages list (`tolerantEnum`, transverse rule). */
export const interactionStatusSchema = tolerantEnum(interactionStatusValues);

export const messageLogEntrySchema = z.object({
  id: z.string().trim().min(1),
  leadId: z.string().trim().min(1),
  channel: z.string().trim().min(1),
  direction: interactionDirectionSchema,
  status: interactionStatusSchema.nullable(),
  supersedesId: z.string().trim().min(1).nullable(),
  content: z.string(),
  sentAt: z.string().nullable(),
  createdAt: z.string(),
});
