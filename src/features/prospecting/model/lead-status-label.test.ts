import { describe, expect, it } from "vitest";
import { leadStatusLabel } from "./lead-prospect";

describe("leadStatusLabel", () => {
  it("labels a known status", () => {
    expect(leadStatusLabel("handed_off")).toBe("Transmis au CRM");
  });

  it("shows a neutral label with the raw value for an unknown status — never throws, never blank", () => {
    expect(leadStatusLabel("some_future_status")).toBe("Statut inconnu : some_future_status");
  });
});
