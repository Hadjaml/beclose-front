import { describe, expect, it } from "vitest";
import { icpEvaluationSchema } from "./icp-evaluation-schema";

// camelCase transcription of bewise_beclose_icp_bant_handoff.md §24's
// worked example.
const bewiseIcpEvaluation = {
  icpProfileId: "icp-1",
  fit: "strong",
  evidence: {
    company: "Entreprise B2B de 42 salariés",
    commercialMaturity: "M2",
    salesModel: "Vente de contrats récurrents",
    prospecting: "Prospection réalisée principalement par les commerciaux",
    decisionMaker: "Head of Sales identifié",
  },
  positiveSignals: ["CRM existant", "Equipe commerciale de 5 personnes", "Pipeline irrégulier"],
  negativeSignals: [],
  reasoningSummary: "Entreprise correspondant fortement à l'ICP Beclose.",
};

describe("icpEvaluationSchema", () => {
  it("accepts the source document's worked ICP evaluation example", () => {
    expect(() => icpEvaluationSchema.parse(bewiseIcpEvaluation)).not.toThrow();
  });

  it("rejects a numeric fit (decision D: qualitative only, no score)", () => {
    const invalid = { ...bewiseIcpEvaluation, fit: 87 };
    expect(() => icpEvaluationSchema.parse(invalid)).toThrow();
  });
});
