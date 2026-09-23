import { describe, expect, it } from "vitest";
import {
  bantCriteriaFormSchema,
  emptyBantCriteriaDraft,
  toBantCriteriaPayload,
} from "./bant-criteria-form-schema";

/** `emptyBantCriteriaDraft` is deliberately not schema-valid on its own —
 * it is the wizard's blank starting point; `profileName` and each
 * criterion's `definition` are required-with-no-default on Beclose's side
 * and have no sensible default value. Real submission is expected to fail
 * until the user fills them in. */
const minimalValidDraft = {
  ...emptyBantCriteriaDraft,
  profileName: "Grille V1",
  budget: { ...emptyBantCriteriaDraft.budget, definition: "def" },
  authority: { ...emptyBantCriteriaDraft.authority, definition: "def" },
  need: { ...emptyBantCriteriaDraft.need, definition: "def" },
  timing: { ...emptyBantCriteriaDraft.timing, definition: "def" },
};

describe("bantCriteriaFormSchema", () => {
  it("accepts a minimally-filled draft (nurtureRules null, every list otherwise empty)", () => {
    expect(() => bantCriteriaFormSchema.parse(minimalValidDraft)).not.toThrow();
  });

  it("rejects the blank starting draft — required text fields have no default", () => {
    expect(() => bantCriteriaFormSchema.parse(emptyBantCriteriaDraft)).toThrow();
  });

  it("rejects a draft missing a required criterion", () => {
    const withoutBudget: Record<string, unknown> = { ...minimalValidDraft };
    delete withoutBudget["budget"];
    expect(() => bantCriteriaFormSchema.parse(withoutBudget)).toThrow();
  });

  it("rejects a criterion with a blank definition", () => {
    const draft = { ...minimalValidDraft, budget: { ...minimalValidDraft.budget, definition: "" } };
    expect(() => bantCriteriaFormSchema.parse(draft)).toThrow();
  });

  it("accepts populated nurtureRules", () => {
    const draft = {
      ...minimalValidDraft,
      nurtureRules: { maxFollowUps: 3, followUpDelayDays: [{ key: "3_6_months", days: 30 }] },
    };
    expect(() => bantCriteriaFormSchema.parse(draft)).not.toThrow();
  });
});

describe("toBantCriteriaPayload", () => {
  it("folds qualificationRules from list-of-pairs into records", () => {
    const draft = bantCriteriaFormSchema.parse({
      ...minimalValidDraft,
      qualificationRules: {
        qualified: [{ key: "need", values: ["strong"] }],
        nurture: [{ key: "need", values: ["moderate"] }],
      },
    });

    const payload = toBantCriteriaPayload(draft);

    expect(payload.qualificationRules).toEqual({
      qualified: { need: ["strong"] },
      nurture: { need: ["moderate"] },
    });
  });

  it("keeps nurtureRules null when not configured", () => {
    const draft = bantCriteriaFormSchema.parse(minimalValidDraft);
    expect(toBantCriteriaPayload(draft).nurtureRules).toBeNull();
  });

  it("folds nurtureRules.followUpDelayDays into a record when configured", () => {
    const draft = bantCriteriaFormSchema.parse({
      ...minimalValidDraft,
      nurtureRules: { maxFollowUps: 3, followUpDelayDays: [{ key: "3_6_months", days: 30 }] },
    });

    expect(toBantCriteriaPayload(draft).nurtureRules).toEqual({
      maxFollowUps: 3,
      followUpDelayDays: { "3_6_months": 30 },
    });
  });
});
