import { describe, expect, it } from "vitest";
import { describeGeographyScope } from "./geography-scope";

const geo = (over: Record<string, unknown>) => ({
  status: "national",
  regions: [] as string[],
  departements: [] as string[],
  unrecognized: [] as string[],
  ...over,
});

describe("describeGeographyScope (what the sourcing really applies — audit B04)", () => {
  it("national: no geographic filter", () => {
    expect(describeGeographyScope(geo({}))).toEqual({
      tone: "info",
      text: "France entière : aucun filtre géographique.",
    });
  });

  it("restricted: names the codes actually applied", () => {
    const result = describeGeographyScope(geo({ status: "restricted", regions: ["53"], departements: ["75", "2A"] }));
    expect(result.tone).toBe("info");
    expect(result.text).toContain("53");
    expect(result.text).toContain("75");
    expect(result.text).toContain("2A");
  });

  it("unsupported: warns that NOTHING is applied and lists the unrecognised values", () => {
    const result = describeGeographyScope(geo({ status: "unsupported", unrecognized: ["Lyon"] }));
    expect(result.tone).toBe("warning");
    expect(result.text).toContain("Lyon");
    expect(result.text).toContain("n’est pas appliquée");
    expect(result.text).toContain("pas restreint géographiquement");
  });

  it("unsupported without a listed value still warns", () => {
    const result = describeGeographyScope(geo({ status: "unsupported" }));
    expect(result.tone).toBe("warning");
  });

  it("an unknown status is stated as unknown, never guessed into national or restricted", () => {
    const result = describeGeographyScope(geo({ status: "brand_new" }));
    expect(result.tone).toBe("neutral");
    expect(result.text).toContain("brand_new");
  });
});
