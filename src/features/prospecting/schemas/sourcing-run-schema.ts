import { z } from "zod";
import { tolerantEnum } from "@/shared/schemas/tolerant-enum";

/**
 * `GET /organizations/{id}/sourcing-runs` (`SourcingRunOut`, Beclose,
 * 24/09/2026 — table `sourcing_runs`). `status` is `running` | `succeeded` |
 * `failed`; a run killed by a service restart is marked `failed` with
 * `errorMessage` "interrompu" (see `isInterruptedRun`).
 *
 * `report` is Beclose's raw JSONB (`workers.sourcing.SourcingReport` +
 * `email_coverage_rate`, snake_case — a plain dict passed through, not
 * camelCased). Since lot 3 (24/09/2026) it is LIVE during a run (updated per
 * page/company) and kept PARTIAL when a run fails, so any key may be absent:
 * counters that existed from the start default to 0, newer or run-end-only
 * ones (`email_coverage_rate`, the lot-3 keys) stay `null` = "not reported",
 * never shown as a zero.
 */
export const sourcingRunStatusValues = ["running", "succeeded", "failed"] as const;
/** Tolerant like every backend-owned status: an unknown one must not fail the
 * whole runs list (`tolerantEnum`, transverse rule 24/09/2026). */
export const sourcingRunStatusSchema = tolerantEnum(sourcingRunStatusValues);
export type SourcingRunStatus = z.infer<typeof sourcingRunStatusSchema>;

export const sourcingRunStageValues = ["starting", "resolving_targets", "processing", "finished"] as const;
export const sourcingRunStageSchema = tolerantEnum(sourcingRunStageValues);
export const sourcingStopReasonValues = ["target_reached", "results_exhausted", "page_budget_exhausted", "hunter_budget_exhausted"] as const;
export const sourcingStopReasonSchema = tolerantEnum(sourcingStopReasonValues);

/** What was really applied to this run (Beclose, B04). Plain strings: the
 * vocabulary is Beclose's and shown as-is / as unknown when not recognised. */
const sourcingGeographyWireSchema = z
  .object({
    status: z.string(),
    source: z.string().nullable().default(null),
    regions: z.array(z.string()).default([]),
    departements: z.array(z.string()).default([]),
    unrecognized: z.array(z.string()).default([]),
  });

const sourcingReportWireSchema = z
  .object({
    naf_codes: z.array(z.string()).default([]),
    companies_found: z.number().default(0),
    companies_with_domain: z.number().default(0),
    // Explicit counters (Beclose, 24/09/2026) — shown as-is, never derived
    // here. `.nullable()` = absent from a report written before they existed.
    companies_without_domain: z.number().nullable().default(null),
    companies_with_email: z.number().default(0),
    companies_without_email: z.number().nullable().default(null),
    companies_skipped_existing: z.number().default(0),
    companies_failed: z.number().default(0),
    companies_excluded_by_headcount: z.number().default(0),
    email_coverage_rate: z.number().nullable().default(null),
    companies_consulted: z.number().nullable().default(null),
    pages_fetched: z.number().nullable().default(null),
    stop_reason: sourcingStopReasonSchema.nullable().default(null),
    hunter_calls: z.number().nullable().default(null),
    geography: sourcingGeographyWireSchema.nullable().default(null),
    companies_retried: z.number().nullable().default(null),
    companies_recovered: z.number().nullable().default(null),
  })
  .transform((raw) => ({
    nafCodes: raw.naf_codes,
    companiesFound: raw.companies_found,
    companiesWithDomain: raw.companies_with_domain,
    companiesWithoutDomain: raw.companies_without_domain,
    companiesWithEmail: raw.companies_with_email,
    companiesWithoutEmail: raw.companies_without_email,
    companiesSkippedExisting: raw.companies_skipped_existing,
    companiesFailed: raw.companies_failed,
    companiesExcludedByHeadcount: raw.companies_excluded_by_headcount,
    emailCoverageRate: raw.email_coverage_rate,
    companiesConsulted: raw.companies_consulted,
    pagesFetched: raw.pages_fetched,
    stopReason: raw.stop_reason,
    hunterCalls: raw.hunter_calls,
    geography: raw.geography,
    companiesRetried: raw.companies_retried,
    companiesRecovered: raw.companies_recovered,
  }));
export type SourcingReport = z.infer<typeof sourcingReportWireSchema>;

export const sourcingRunSchema = z.object({
  id: z.string().trim().min(1),
  status: sourcingRunStatusSchema,
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
  errorMessage: z.string().nullable(),
  /** Where the run is (lot 3); `null` on a build that predates it. */
  stage: sourcingRunStageSchema.nullable().default(null),
  /** Last sign of life of a running run. */
  lastProgressAt: z.string().nullable().default(null),
  report: sourcingReportWireSchema.nullable(),
});
export type SourcingRun = z.infer<typeof sourcingRunSchema>;
