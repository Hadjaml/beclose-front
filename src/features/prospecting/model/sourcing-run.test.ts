import { describe, expect, it } from "vitest";
import { sourcingRunSchema } from "../schemas/sourcing-run-schema";
import { sourcingFunnel, sourcingRunDisplayStatus } from "./sourcing-run";

const wireRun = {
  id: "run-1",
  status: "succeeded",
  startedAt: "2026-09-24T09:00:00Z",
  finishedAt: "2026-09-24T09:30:00Z",
  errorMessage: null,
  // Raw JSONB from Beclose: snake_case, passed through as-is.
  report: {
    naf_codes: ["81.21Z"],
    companies_found: 20,
    companies_with_domain: 8,
    companies_with_email: 3,
    companies_skipped_existing: 5,
    companies_failed: 2,
    companies_excluded_by_headcount: 4,
    email_coverage_rate: 0.15,
  },
};

describe("sourcingRunSchema", () => {
  it("parses a run and normalizes the raw snake_case report to camelCase", () => {
    const run = sourcingRunSchema.parse(wireRun);
    expect(run.report?.companiesFound).toBe(20);
    expect(run.report?.emailCoverageRate).toBe(0.15);
  });

  it("defaults counters missing from an older report to 0 and accepts a null report", () => {
    const partial = sourcingRunSchema.parse({ ...wireRun, report: { companies_found: 7 } });
    expect(partial.report?.companiesWithEmail).toBe(0);
    expect(sourcingRunSchema.parse({ ...wireRun, status: "running", report: null }).report).toBeNull();
  });

  it("rejects an unknown status", () => {
    expect(() => sourcingRunSchema.parse({ ...wireRun, status: "paused" })).toThrow();
  });
});

describe("sourcingRunDisplayStatus", () => {
  it("shows a run killed by a restart as interrupted, apart from a genuine failure", () => {
    const failed = sourcingRunSchema.parse({ ...wireRun, status: "failed", report: null, errorMessage: "interrompu" });
    expect(sourcingRunDisplayStatus(failed)).toBe("interrupted");
    expect(sourcingRunDisplayStatus({ ...failed, errorMessage: "ValueError: boom" })).toBe("failed");
  });
});

describe("sourcingFunnel", () => {
  it("derives the no-site / no-email drop-offs from Beclose's counters", () => {
    const report = sourcingRunSchema.parse(wireRun).report;
    if (report === null) throw new Error("report expected");
    const lines = Object.fromEntries(sourcingFunnel(report).map((l) => [l.label, l.value]));
    // 20 processed - 2 failed - 8 with a site = 10 without a site.
    expect(lines["sans site web trouvé"]).toBe(10);
    // 8 with a site - 3 with an e-mail = 5 without an e-mail.
    expect(lines["dont sans e-mail trouvé"]).toBe(5);
    expect(lines["Avec e-mail exploitable (leads)"]).toBe(3);
  });

  it("never shows a negative derived count", () => {
    const report = sourcingRunSchema.parse({
      ...wireRun,
      report: { companies_found: 1, companies_with_domain: 5, companies_with_email: 9 },
    }).report;
    if (report === null) throw new Error("report expected");
    expect(sourcingFunnel(report).every((l) => l.value >= 0)).toBe(true);
  });
});
