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
/** Conformity to the ICP of the SOURCED companies (Beclose, B07) — the real
 * targeting measure, judged on the ICP version each company was sourced with
 * and on preserved evidence (headcount band). Distinct from `automatic`
 * (BANT proxy on transmitted leads). `conformShare` excludes the unknowns:
 * read it with `coverage`. Both can be `null`. */
export const targetingSchema = z.object({
  /** Companies sourced with a recorded ICP version. */
  sourced: z.number().int().nonnegative(),
  /** No recorded ICP version (manual or pre-tracking sourcing): apart. */
  notRecorded: z.number().int().nonnegative(),
  /** Headcount band within the PREFERRED range. */
  conform: z.number().int().nonnegative(),
  /** Outside the preferred range but within the reject bounds. */
  tolerated: z.number().int().nonnegative(),
  nonConform: z.number().int().nonnegative(),
  /** Unknown headcount band — separated from the measure, never a failure. */
  unknown: z.number().int().nonnegative(),
  measurable: z.number().int().nonnegative(),
  conformShare: z.number().nullable(),
  coverage: z.number().nullable(),
  byIcpVersion: z
    .array(
      z.object({
        profileId: z.string(),
        version: z.number().int(),
        sourced: z.number().int().nonnegative(),
        conform: z.number().int().nonnegative(),
        tolerated: z.number().int().nonnegative(),
        nonConform: z.number().int().nonnegative(),
        unknown: z.number().int().nonnegative(),
      }),
    )
    .default([]),
});
export type Targeting = z.infer<typeof targetingSchema>;

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
  /** `null` = a backend that predates the targeting measure. */
  targeting: targetingSchema.nullable().default(null),
});
export type Precision = z.infer<typeof precisionSchema>;
