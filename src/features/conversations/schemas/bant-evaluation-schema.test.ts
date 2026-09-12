import { describe, expect, it } from "vitest";
import { bantEvaluationSchema } from "./bant-evaluation-schema";

// camelCase transcription of bewise_beclose_icp_bant_handoff.md §25's
// worked example.
const bewiseBantEvaluation = {
  criteriaVersion: 1,
  budget: { status: "probable", evidence: "Utilise déjà une agence de prospection" },
  authority: { status: "decision_maker", evidence: "Head of Sales responsable du budget commercial" },
  need: {
    status: "strong",
    evidence: "Manque de rendez-vous et équipe passant plusieurs heures par semaine au sourcing",
  },
  timing: { status: "0_90_days", evidence: "Souhaite tester une nouvelle approche dès le mois prochain" },
  result: "qualified",
};

describe("bantEvaluationSchema", () => {
  it("accepts the source document's worked BANT evaluation example", () => {
    expect(() => bantEvaluationSchema.parse(bewiseBantEvaluation)).not.toThrow();
  });

  it("accepts a lead with a custom criterion alongside the fixed four", () => {
    const withCustomCriterion = {
      ...bewiseBantEvaluation,
      customCriteria: [
        { label: "Zone géographique cible", state: "KNOWN", information: "Paris intra-muros" },
      ],
    };
    expect(() => bantEvaluationSchema.parse(withCustomCriterion)).not.toThrow();
  });

  it("rejects a need status that isn't in the document's vocabulary", () => {
    const invalid = { ...bewiseBantEvaluation, need: { status: "high", evidence: "x" } };
    expect(() => bantEvaluationSchema.parse(invalid)).toThrow();
  });
});
