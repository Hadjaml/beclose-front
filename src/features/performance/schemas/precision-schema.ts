import { z } from "zod";

/**
 * `GET /organizations/{id}/precision` (`PrecisionOut`, Beclose, 24/09/2026)
 * — camelCase already. Deliberately **no single "precision" figure**: the
 * numeric definition of the 80–90 % target is not settled (Hadja), so
 * Beclose exposes named components and this schema mirrors them as-is.
 * Separate from the speculative `workspacePerformanceSchema` (metrics/
 * funnel/breakdown/insights), which has no backend counterpart.
 *
 * Ratios are `null` when their denominator is zero (no lead transmitted /
 * no outcome declared yet) — not 0 %.
 */
export const precisionSchema = z.object({
  transmitted: z.number().int().nonnegative(),
  booked: z.number().int().nonnegative(),
  handedOffStrongNeed: z.number().int().nonnegative(),
  /** Transmitted for a technical reason (booking failure) — not a signal of relevance. */
  handedOffTechnical: z.number().int().nonnegative(),
  converted: z.number().int().nonnegative(),
  automatic: z.object({
    /** Transmitted leads the organization's own BANT grid judged `qualified` — a proxy, not real relevance. */
    qualifiedByGrid: z.number().int().nonnegative(),
    qualifiedShare: z.number().nullable(),
  }),
  manual: z.object({
    won: z.number().int().nonnegative(),
    lost: z.number().int().nonnegative(),
    /** Transmitted with no outcome declared. */
    unknown: z.number().int().nonnegative(),
    /** `(won + lost) / transmitted` — how much of the picture we actually have. */
    outcomeCoverage: z.number().nullable(),
    /** `won / (won + lost)` — a closing rate over declared outcomes, NOT a precision. */
    winRateAmongKnown: z.number().nullable(),
  }),
});
export type Precision = z.infer<typeof precisionSchema>;
