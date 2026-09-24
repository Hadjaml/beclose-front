import { describe, expect, it } from "vitest";
import {
  handoffReasonKind,
  handoffReasonLabel,
  handoffReasonToneClass,
  icpFitLabel,
  leadOutcomeLabel,
  qualificationResultLabel,
} from "./lead-prospect";

describe("backend vocabularies that may grow — known values keep their meaning", () => {
  it("keeps the success/failure distinction for known handoff reasons", () => {
    expect(handoffReasonKind("strong_need_signal")).toBe("success");
    expect(handoffReasonKind("booking_error")).toBe("failure");
    expect(handoffReasonToneClass("strong_need_signal")).toBe("text-emerald-700");
    expect(handoffReasonToneClass("booking_error")).toBe("text-red-700");
  });

  it("labels known values", () => {
    expect(qualificationResultLabel("nurture")).toBe("En maturation");
    expect(icpFitLabel("strong")).toBe("Fort");
    expect(leadOutcomeLabel("won")).toBe("Gagné");
  });
});

describe("backend vocabularies that may grow — an unknown value is neutral, never guessed", () => {
  it("renders an unknown handoff reason neither green nor red", () => {
    expect(handoffReasonKind("opted_out_by_prospect")).toBe("unknown");
    const tone = handoffReasonToneClass("opted_out_by_prospect");
    expect(tone).not.toContain("emerald");
    expect(tone).not.toContain("red");
    expect(handoffReasonLabel("opted_out_by_prospect")).toBe("Motif inconnu : opted_out_by_prospect");
  });

  it("gives every other unknown value a neutral label carrying the raw value", () => {
    expect(qualificationResultLabel("maybe_later")).toBe("Résultat inconnu : maybe_later");
    expect(icpFitLabel("excellent")).toBe("Adéquation inconnue : excellent");
    expect(leadOutcomeLabel("postponed")).toBe("Issue inconnue : postponed");
  });
});
