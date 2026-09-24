import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./format-date-time";

describe("formatDateTime (French, readable — audit C11)", () => {
  it("turns an ISO timestamp into a French date and time", () => {
    expect(formatDateTime("2026-09-24T09:05:00Z", { timeZone: "UTC" })).toBe("24 sept. 2026, 09:05");
  });

  it("never shows the raw ISO string", () => {
    expect(formatDateTime("2026-09-24T09:05:00Z", { timeZone: "UTC" })).not.toContain("T09");
  });

  it("returns an unparseable value as-is instead of 'Invalid Date' or throwing", () => {
    expect(formatDateTime("pas une date")).toBe("pas une date");
  });
});

describe("formatDate", () => {
  it("gives a long French date", () => {
    expect(formatDate("2026-09-24T09:05:00Z", { timeZone: "UTC" })).toBe("24 septembre 2026");
  });
});
