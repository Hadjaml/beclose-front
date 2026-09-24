import { z } from "zod";

/**
 * `GET /organizations/{id}/sourcing-runs` (`SourcingRunOut`, Beclose,
 * 24/09/2026 — table `sourcing_runs`). `status` is `running` | `succeeded` |
 * `failed`; a run killed by a service restart is marked `failed` with
 * `errorMessage` "interrompu" (see `isInterruptedRun`).
 *
 * `report` is Beclose's raw JSONB (`workers.sourcing.SourcingReport` +
 * `email_coverage_rate`, snake_case — a plain dict passed through, not
 * camelCased), only set on a `succeeded` run. Counters absent from an older
 * report default to 0.
 */
export const sourcingRunStatusSchema = z.enum(["running", "succeeded", "failed"]);
export type SourcingRunStatus = z.infer<typeof sourcingRunStatusSchema>;

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
    email_coverage_rate: z.number().default(0),
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
  }));
export type SourcingReport = z.infer<typeof sourcingReportWireSchema>;

export const sourcingRunSchema = z.object({
  id: z.string().trim().min(1),
  status: sourcingRunStatusSchema,
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
  errorMessage: z.string().nullable(),
  report: sourcingReportWireSchema.nullable(),
});
export type SourcingRun = z.infer<typeof sourcingRunSchema>;
