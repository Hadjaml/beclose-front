import { describe, expect, it } from "vitest";
import { availableOutcomeActions } from "./lead-prospect";

describe("availableOutcomeActions (mirrors Beclose's record_outcome rules)", () => {
  it("offers nothing for a lead that was never transmitted", () => {
    for (const status of ["identified", "contacted", "replied", "qualified", "opted_out", "bounced", "disqualified"] as const) {
      expect(availableOutcomeActions({ status, outcome: null })).toEqual([]);
    }
  });

  it("offers won and lost on a transmitted lead with no outcome", () => {
    expect(availableOutcomeActions({ status: "handed_off", outcome: null })).toEqual(["won", "lost"]);
    expect(availableOutcomeActions({ status: "booked", outcome: null })).toEqual(["won", "lost"]);
  });

  it("offers only won on an already-converted lead (it can never be declared lost)", () => {
    expect(availableOutcomeActions({ status: "converted", outcome: null })).toEqual(["won"]);
  });

  it("lets a lost lead still be marked won, but nothing else", () => {
    expect(availableOutcomeActions({ status: "handed_off", outcome: "lost" })).toEqual(["won"]);
  });

  it("offers nothing once won: won → lost is refused, converted is terminal", () => {
    expect(availableOutcomeActions({ status: "converted", outcome: "won" })).toEqual([]);
  });

  it("offers nothing for a status it does not know, rather than guessing", () => {
    expect(availableOutcomeActions({ status: "some_future_status", outcome: null })).toEqual([]);
  });

  it("offers nothing when the declared outcome is one it does not know", () => {
    expect(availableOutcomeActions({ status: "handed_off", outcome: "postponed" })).toEqual([]);
  });
});
