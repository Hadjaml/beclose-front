import { describe, expect, it } from "vitest";
import { bantEvaluationSchema } from "./bant-evaluation-schema";

// camelCase transcription of bewise_beclose_icp_bant_handoff.md §25's
// worked example, adapted to reference the grid by id
// (qualificationCriteriaId is the source of truth, cross-validated
// 2026-09-12 — the source document's bare "criteria_version" number
// doesn't survive as the field's shape, only as an optional display value
// derived from the FK).
const bewiseBantEvaluation = {
  qualificationCriteriaId: "bant-1",
  qualificationCriteriaVersion: 1,
  budget: {
    status: "probable",
    evidence: "Utilise déjà une agence de prospection",
    sourceInteractionId: "interaction-1",
  },
  authority: {
    status: "decision_maker",
    evidence: "Head of Sales responsable du budget commercial",
    sourceInteractionId: "interaction-1",
  },
  need: {
    status: "strong",
    evidence: "Manque de rendez-vous et équipe passant plusieurs heures par semaine au sourcing",
    sourceInteractionId: "interaction-2",
  },
  timing: {
    status: "0_90_days",
    evidence: "Souhaite tester une nouvelle approche dès le mois prochain",
    sourceInteractionId: "interaction-2",
  },
  result: "qualified",
};

describe("bantEvaluationSchema", () => {
  it("accepts the source document's worked BANT evaluation example", () => {
    expect(() => bantEvaluationSchema.parse(bewiseBantEvaluation)).not.toThrow();
  });

  it("accepts a criterion without sourceInteractionId or a version number (both optional)", () => {
    const minimal = {
      qualificationCriteriaId: "bant-1",
      budget: { status: "unknown" },
      authority: { status: "unknown" },
      need: { status: "none" },
      timing: { status: "unknown" },
      result: "not_qualified",
    };
    expect(() => bantEvaluationSchema.parse(minimal)).not.toThrow();
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
