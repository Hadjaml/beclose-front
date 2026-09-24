import { z } from "zod";

/**
 * `GET /organizations/{id}/approval-metrics` (`ApprovalMetricsOut`, Beclose,
 * 24/09/2026, EF-801) — correction rate of outbound messages and where the
 * organization stands against the "durably low correction rate" criterion.
 * Read-only: nothing is automated, no automatic sending exists. The three
 * criterion parameters (`windowSize`, `maxCorrectionRate`,
 * `windowsRequired`) are Beclose's *proposals*, not yet validated.
 */
export const approvalCriterionSchema = z.object({
  windowSize: z.number().int().positive(),
  maxCorrectionRate: z.number(),
  windowsRequired: z.number().int().positive(),
  /** Correction rate of the most recent complete windows, newest first. */
  windowRates: z.array(z.number()),
  sufficientData: z.boolean(),
  met: z.boolean(),
});

export const approvalMetricsSchema = z.object({
  decided: z.number().int().nonnegative(),
  acceptedAsIs: z.number().int().nonnegative(),
  corrected: z.number().int().nonnegative(),
  rejected: z.number().int().nonnegative(),
  /** Awaiting a human decision — not counted in the rate. */
  pending: z.number().int().nonnegative(),
  /** `(corrected + rejected) / decided`; `null` until a message is decided. */
  correctionRate: z.number().nullable(),
  criterion: approvalCriterionSchema,
});
export type ApprovalMetrics = z.infer<typeof approvalMetricsSchema>;
