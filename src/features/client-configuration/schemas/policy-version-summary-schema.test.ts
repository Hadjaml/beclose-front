import { describe, expect, it } from "vitest";
import { policyVersionSummarySchema } from "./policy-version-summary-schema";

const wire = {
  id: "icp-1",
  name: "Profil V1",
  version: 1,
  status: "active",
  activatedAt: null,
  createdAt: "2026-09-24T00:00:00Z",
};

describe("policyVersionSummarySchema", () => {
  it("parses a known status", () => {
    expect(policyVersionSummarySchema.parse(wire).status).toBe("active");
  });

  it("does not turn a successful creation into an error when the status is new to this frontend", () => {
    expect(policyVersionSummarySchema.parse({ ...wire, status: "superseded" }).status).toBe("superseded");
  });
});
