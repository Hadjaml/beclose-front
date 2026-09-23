import { describe, expect, it } from "vitest";
import { bantCriteriaWireSchema } from "./bant-criteria-wire-schema";

const realWire = {
  schema_version: "1.0",
  profile_name: "Bewise BANT V0",
  budget: {
    definition: "def",
    status_values: ["validated", "unknown"],
    positive_signals: ["a"],
    negative_signals: ["b"],
    questions: ["q"],
    explicit_amount_required: true,
  },
  authority: {
    definition: "def",
    status_values: ["decision_maker", "unknown"],
    decision_maker_titles: ["CEO"],
    champion_titles: ["Manager"],
    questions: ["q"],
  },
  need: {
    definition: "def",
    status_values: ["strong", "none"],
    strong_signals: ["a"],
    moderate_signals: ["b"],
    negative_signals: ["c"],
    disqualifiers: ["d"],
    questions: ["q"],
  },
  timing: {
    definition: "def",
    status_values: ["0_90_days", "unknown"],
    qualified_horizon_days: 90,
    nurture_horizon_days: 180,
    questions: ["q"],
    negative_signals: ["a"],
  },
  qualification_rules: {
    qualified: { need: ["strong"] },
    nurture: { need: ["moderate"] },
  },
  handoff_rules: {
    explicit_meeting_request: true,
    strong_need_and_human_request: false,
    strong_buying_intent: false,
  },
  conversation_policy: {
    avoid_interrogation_style: true,
    infer_before_asking: true,
    prefer_contextual_questions: true,
    explicit_budget_question_only_when_needed: true,
  },
};

describe("bantCriteriaWireSchema", () => {
  it("parses the real Beclose wire shape (snake_case) and normalizes to camelCase", () => {
    const parsed = bantCriteriaWireSchema.parse(realWire);
    expect(parsed.schemaVersion).toBe("1.0");
    expect(parsed.budget.explicitAmountRequired).toBe(true);
    expect(parsed.authority).not.toHaveProperty("positive_signals");
    expect(parsed.need.strongSignals).toEqual(["a"]);
    expect(parsed.timing.negativeSignals).toEqual(["a"]);
    expect(parsed.qualificationRules.qualified["need"]).toEqual(["strong"]);
    expect(parsed.nurtureRules).toBeNull();
    expect(parsed.customCriteria).toBeNull();
  });

  it("parses nurture_rules and custom_criteria when present", () => {
    const withOptionals = {
      ...realWire,
      nurture_rules: { max_follow_ups: 2, follow_up_delay_days: { "0_90_days": 10 } },
      custom_criteria: { sector_fit: "ok" },
    };
    const parsed = bantCriteriaWireSchema.parse(withOptionals);
    expect(parsed.nurtureRules).toEqual({ maxFollowUps: 2, followUpDelayDays: { "0_90_days": 10 } });
    expect(parsed.customCriteria).toEqual({ sector_fit: "ok" });
  });

  it("rejects a shape missing a required criterion", () => {
    const withoutBudget: Record<string, unknown> = { ...realWire };
    delete withoutBudget["budget"];
    expect(() => bantCriteriaWireSchema.parse(withoutBudget)).toThrow();
  });
});
