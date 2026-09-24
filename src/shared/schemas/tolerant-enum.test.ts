import { afterEach, describe, expect, it, vi } from "vitest";
import { describeEnumValue, tolerantEnum } from "./tolerant-enum";

const statusSchema = tolerantEnum(["active", "done"] as const);
const labels = { active: "Actif", done: "Terminé" } as const;
type Known = keyof typeof labels;
// Explicit generic: inference from a bare literal would narrow `Known` to it.
const describe_ = (value: string) => describeEnumValue<Known>(labels, value);

describe("tolerantEnum", () => {
  afterEach(() => vi.restoreAllMocks());

  it("accepts a known value unchanged", () => {
    expect(statusSchema.parse("active")).toBe("active");
  });

  it("accepts a value the frontend has never heard of instead of throwing", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(statusSchema.parse("brand_new")).toBe("brand_new");
  });

  it("still rejects a non-string (a genuinely malformed payload)", () => {
    expect(() => statusSchema.parse(42)).toThrow();
    expect(() => statusSchema.parse(null)).toThrow();
  });

  it("warns once per unknown value outside production, so drift is noticed in dev", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    statusSchema.parse("drifted_once");
    statusSchema.parse("drifted_once");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("drifted_once");
  });
});

describe("describeEnumValue", () => {
  it("returns the label of a known value", () => {
    expect(describe_("done")).toBe("Terminé");
  });

  it("returns a neutral label carrying the raw value for an unknown one", () => {
    expect(describe_("brand_new")).toBe("Statut inconnu : brand_new");
  });

  it("does not mistake an Object.prototype key for a known value", () => {
    expect(describe_("toString")).toBe("Statut inconnu : toString");
    expect(describe_("constructor")).toBe("Statut inconnu : constructor");
  });
});
