import { describe, expect, it } from "vitest";
import { bantCriteriaFormSchema, toBantCriteriaPayload } from "../schemas/bant-criteria-form-schema";
import { bantCriteriaWireSchema } from "../schemas/bant-criteria-wire-schema";
import { icpCriteriaFormSchema, toIcpCriteriaPayload } from "../schemas/icp-criteria-form-schema";
import { icpCriteriaWireSchema } from "../schemas/icp-criteria-wire-schema";
import { bantCriteriaWire, icpCriteriaWire } from "../../../../tests/support/criteria-wire-fixtures";
import { bantDraftFromActive, icpDraftFromActive } from "./criteria-prefill";

describe("icpDraftFromActive (new version prefilled from the active one)", () => {
  const active = icpCriteriaWireSchema.parse(icpCriteriaWire);

  it("carries every field, including sectors per tier and maturity levels as editable pairs", () => {
    const draft = icpDraftFromActive({ name: "Profil actif", criteria: active });

    expect(draft.profileName).toBe("Profil actif");
    expect(draft.prioritySectors).toEqual([
      { tier: 1, sectors: [{ id: "building_maintenance", labelFr: "Rénovation" }, { id: "saas", labelFr: null }] },
      { tier: 2, sectors: [{ id: "industry", labelFr: "Industrie" }] },
    ]);
    expect(draft.commercialMaturity.levels).toEqual([
      { key: "M2", description: "Structuré" },
      { key: "M3", description: "Équipe commerciale" },
    ]);
    expect(draft.companyFit.employeeRange).toEqual({ min: 10, max: 150, hardFilter: false, rejectBelow: 5, rejectAbove: 300 });
    expect(draft.decisionMakers.potentialChampions).toEqual(["Assistant de direction"]);
  });

  it("is faithful: re-submitting the untouched draft sends exactly what is stored, and passes validation", () => {
    const draft = icpDraftFromActive({ name: active.profileName, criteria: active });

    expect(icpCriteriaFormSchema.safeParse(draft).success).toBe(true);
    expect(toIcpCriteriaPayload(draft)).toEqual(active);
  });

  it("does not share mutable arrays with the active version", () => {
    const draft = icpDraftFromActive({ name: "x", criteria: active });
    draft.market.geographies.push("Belgique");
    expect(active.market.geographies).toEqual(["France"]);
  });
});

describe("bantDraftFromActive", () => {
  const active = bantCriteriaWireSchema.parse(bantCriteriaWire);

  it("turns the free-form rule and delay maps into editable pairs", () => {
    const draft = bantDraftFromActive({ name: "Grille active", criteria: active });

    expect(draft.profileName).toBe("Grille active");
    expect(draft.qualificationRules.qualified).toEqual([
      { key: "need", values: ["strong", "moderate"] },
      { key: "timing", values: ["0_90_days"] },
    ]);
    expect(draft.nurtureRules).toEqual({
      maxFollowUps: 3,
      followUpDelayDays: [
        { key: "3_6_months", days: 30 },
        { key: "over_6_months", days: 60 },
      ],
    });
  });

  it("is faithful, and keeps the custom criteria the form cannot edit (a new version must not silently drop them)", () => {
    const draft = bantDraftFromActive({ name: active.profileName, criteria: active });

    expect(bantCriteriaFormSchema.safeParse(draft).success).toBe(true);
    expect(toBantCriteriaPayload(draft)).toEqual(active);
    expect(toBantCriteriaPayload(draft).customCriteria).toEqual({ sector_fit: "ok", weights: { a: 1 } });
  });

  it("keeps an absent nurture policy absent", () => {
    const withoutNurture: Record<string, unknown> = { ...bantCriteriaWire };
    delete withoutNurture["nurture_rules"];
    const parsed = bantCriteriaWireSchema.parse(withoutNurture);
    expect(bantDraftFromActive({ name: "x", criteria: parsed }).nurtureRules).toBeNull();
  });
});
