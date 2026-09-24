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
    companies_without_domain: 10,
    companies_with_email: 3,
    companies_without_email: 5,
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

  it("accepts a status Beclose added later, shown as unknown rather than failing the list", () => {
    const run = sourcingRunSchema.parse({ ...wireRun, status: "paused", report: null });
    expect(run.status).toBe("paused");
    expect(sourcingRunDisplayStatus(run)).toBe("unknown");
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
  it("shows Beclose's explicit no-site / no-email counters as-is", () => {
    const report = sourcingRunSchema.parse(wireRun).report;
    if (report === null) throw new Error("report expected");
    const lines = Object.fromEntries(sourcingFunnel(report).map((l) => [l.label, l.value]));
    expect(lines["sans site officiel trouvé"]).toBe(10);
    expect(lines["site trouvé, mais aucun e-mail exploitable"]).toBe(5);
    expect(lines["en échec de traitement"]).toBe(2);
    expect(lines["Avec e-mail exploitable (leads)"]).toBe(3);
  });

  it("does no arithmetic: the shown counters are exactly the reported ones, even if they do not add up", () => {
    const report = sourcingRunSchema.parse({
      ...wireRun,
      report: { ...wireRun.report, companies_without_domain: 99 },
    }).report;
    if (report === null) throw new Error("report expected");
    const noSite = sourcingFunnel(report).find((l) => l.label === "sans site officiel trouvé");
    expect(noSite?.value).toBe(99);
  });

  it("leaves the two counters out of a report written before they existed, instead of guessing", () => {
    const report = sourcingRunSchema.parse({
      ...wireRun,
      report: { companies_found: 20, companies_with_domain: 8, companies_with_email: 3 },
    }).report;
    if (report === null) throw new Error("report expected");
    const labels = sourcingFunnel(report).map((l) => l.label);
    expect(labels).not.toContain("sans site officiel trouvé");
    expect(labels).not.toContain("site trouvé, mais aucun e-mail exploitable");
  });
});
