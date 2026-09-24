import { describe, expect, it } from "vitest";
import { bantStatusLabel } from "./bant-criteria";

describe("bantStatusLabel", () => {
  it("labels the values of Bewise's own grid", () => {
    expect(bantStatusLabel("budget", "validated")).toBe("Validé");
    expect(bantStatusLabel("authority", "decision_maker")).toBe("Décideur");
    expect(bantStatusLabel("need", "strong")).toBe("Fort");
    expect(bantStatusLabel("timing", "0_90_days")).toBe("0–90 jours");
  });

  it("shows a custom-vocabulary value as-is, never blank or undefined", () => {
    // An organization onboarded from the interface defines its own status_values.
    expect(bantStatusLabel("budget", "financement_acquis")).toBe("financement_acquis");
    expect(bantStatusLabel("authority", "comite_achat")).toBe("comite_achat");
    expect(bantStatusLabel("need", "urgent_reglementaire")).toBe("urgent_reglementaire");
    expect(bantStatusLabel("timing", "prochain_trimestre")).toBe("prochain_trimestre");
  });

  it("does not apply another criterion's label to a value that only exists there", () => {
    // `strong` is a NEED value in Bewise's grid — for a custom BUDGET vocabulary it is just a word.
    expect(bantStatusLabel("budget", "strong")).toBe("strong");
  });

  it("never renders an inherited Object.prototype member as a label", () => {
    for (const value of ["constructor", "toString", "hasOwnProperty", "__proto__", "valueOf"]) {
      const label = bantStatusLabel("need", value);
      expect(typeof label).toBe("string");
      expect(label).toBe(value);
    }
  });
});
