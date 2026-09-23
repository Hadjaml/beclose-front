import { describe, expect, it } from "vitest";
import {
  emptyIcpCriteriaDraft,
  icpCriteriaFormSchema,
  toIcpCriteriaPayload,
} from "./icp-criteria-form-schema";

/** `emptyIcpCriteriaDraft` is deliberately not schema-valid on its own — it
 * is the wizard's blank starting point, and several fields Beclose marks
 * required-with-no-default (`profileName`, `purpose`,
 * `commercialMaturity.preferredLevel`) have no sensible default value.
 * Real submission is expected to fail until the user fills them in, same
 * as any other required field — this is `minimalValidDraft`. */
const minimalValidDraft = {
  ...emptyIcpCriteriaDraft,
  profileName: "Profil V1",
  purpose: "Cibler les PME B2B.",
  commercialMaturity: {
    ...emptyIcpCriteriaDraft.commercialMaturity,
    levels: [{ key: "structure", description: "Process commercial en place" }],
    preferredLevel: "structure",
  },
};

describe("icpCriteriaFormSchema", () => {
  it("accepts a minimally-filled draft (every list can otherwise start empty)", () => {
    expect(() => icpCriteriaFormSchema.parse(minimalValidDraft)).not.toThrow();
  });

  it("rejects the blank starting draft — required text fields have no default", () => {
    expect(() => icpCriteriaFormSchema.parse(emptyIcpCriteriaDraft)).toThrow();
  });

  it("rejects a draft missing a required top-level field", () => {
    const withoutPurpose: Record<string, unknown> = { ...minimalValidDraft };
    delete withoutPurpose["purpose"];
    expect(() => icpCriteriaFormSchema.parse(withoutPurpose)).toThrow();
  });

  it("accepts a real employeeRange with reject bounds", () => {
    const draft = {
      ...minimalValidDraft,
      companyFit: {
        ...minimalValidDraft.companyFit,
        employeeRange: { min: 10, max: 150, hardFilter: false, rejectBelow: 5, rejectAbove: 300 },
      },
    };
    const parsed = icpCriteriaFormSchema.parse(draft);
    expect(parsed.companyFit.employeeRange.rejectBelow).toBe(5);
  });

  it("accepts sectors as {id, labelFr}", () => {
    const draft = {
      ...minimalValidDraft,
      prioritySectors: [{ tier: 1, sectors: [{ id: "commercial_cleaning", labelFr: "Nettoyage" }] }],
    };
    expect(() => icpCriteriaFormSchema.parse(draft)).not.toThrow();
  });
});

describe("toIcpCriteriaPayload", () => {
  it("folds commercialMaturity.levels from list-of-pairs into a record", () => {
    const draft = icpCriteriaFormSchema.parse({
      ...minimalValidDraft,
      commercialMaturity: {
        ...minimalValidDraft.commercialMaturity,
        levels: [
          { key: "debutant", description: "Pas de process commercial" },
          { key: "structure", description: "Process commercial en place" },
        ],
      },
    });

    const payload = toIcpCriteriaPayload(draft);

    expect(payload.commercialMaturity.levels).toEqual({
      debutant: "Pas de process commercial",
      structure: "Process commercial en place",
    });
  });
});
