import { z } from "zod";

/**
 * Matches Beclose's real `/organizations/{id}/messages`
 * (`MessageOut`, `api/routers/organizations.py`) — the raw, append-only
 * `interactions` audit log (EF-705), read-only. Approving/rejecting a
 * pending message stays Telegram-only, never duplicated here (per the
 * contract). `status` is `null` for every `INBOUND` row by design (only
 * outbound messages go through an approval cycle) — not an anomaly.
 */
export const interactionDirectionSchema = z.enum(["outbound", "inbound"]);

export const interactionStatusSchema = z.enum([
  "pending_approval",
  "approved",
  "rejected",
  "sent",
  "superseded",
  // System cancellation of a pending follow-up when the lead opts out or is
  // disqualified (Beclose, 24/09/2026) — distinct from `rejected`, a human
  // decision. Without it a single such message fails the whole list.
  "cancelled",
]);

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
