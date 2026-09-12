import { describe, expect, it } from "vitest";
import { bantCriteriaVersionSchema } from "./bant-criteria-schema";

// camelCase transcription of bewise_beclose_icp_bant_handoff.md §16's JSON
// example, wrapped in the versioned envelope (§3.1).
const bewiseBantV0 = {
  id: "bant-1",
  organizationId: "org-bewise",
  name: "Bewise - Beclose BANT V0",
  version: 1,
  status: "active",
  supersedesId: null,
  createdAt: "2026-09-12T00:00:00Z",
  activatedAt: "2026-09-12T00:00:00Z",
  createdBy: "rochinel",
  notes: null,
  criteria: {
    schemaVersion: "1.0",
    budget: {
      definition: "Capacité et volonté d'investir dans un système de génération de pipeline B2B",
      statusValues: ["validated", "probable", "unknown", "insufficient"],
      positiveSignals: ["Budget commercial ou acquisition existant"],
      negativeSignals: ["Budget explicitement gelé"],
      questions: ["Comment générez-vous aujourd'hui vos nouveaux rendez-vous commerciaux ?"],
      explicitAmountRequired: false,
    },
    authority: {
      definition: "Capacité à décider de l'achat ou accès direct aux personnes capables de le décider",
      statusValues: ["decision_maker", "champion", "influencer", "unknown", "no_authority"],
      positiveSignals: [],
      negativeSignals: [],
      questions: ["Qui serait impliqué chez vous si vous décidiez de mettre en place ce système ?"],
      decisionMakerTitles: ["Founder", "CEO", "VP Sales"],
      championTitles: ["Head of Growth", "Sales Manager"],
    },
    need: {
      definition: "Existence d'un problème réel de génération de pipeline B2B que Beclose peut résoudre",
      statusValues: ["strong", "moderate", "weak", "none"],
      positiveSignals: ["Pipeline commercial insuffisant"],
      negativeSignals: ["Aucun problème commercial identifié"],
      questions: ["Comment obtenez-vous aujourd'hui vos nouveaux clients ?"],
      disqualifiers: ["Offre pas encore validée"],
    },
    timing: {
      definition: "Horizon réel dans lequel l'entreprise pourrait mettre en place Beclose",
      statusValues: ["0_90_days", "3_6_months", "over_6_months", "unknown"],
      positiveSignals: [],
      negativeSignals: ["Projet sans calendrier"],
      questions: ["Y a-t-il un événement ou une échéance qui pousse ce sujet actuellement ?"],
      qualifiedHorizonDays: 90,
      nurtureHorizonDays: 180,
    },
    qualificationRules: {
      qualified: {
        need: ["strong"],
        authority: ["decision_maker", "champion"],
        timing: ["0_90_days"],
        budgetNot: ["insufficient"],
      },
      nurture: {
        need: ["strong", "moderate"],
        timing: ["3_6_months", "over_6_months"],
      },
    },
    handoffRules: {
      explicitMeetingRequest: true,
      strongNeedAndHumanRequest: true,
      strongBuyingIntent: true,
    },
    conversationPolicy: {
      avoidInterrogationStyle: true,
      inferBeforeAsking: true,
      preferContextualQuestions: true,
      explicitBudgetQuestionOnlyWhenNeeded: true,
    },
  },
};

describe("bantCriteriaVersionSchema", () => {
  it("accepts the source document's Bewise BANT V0 example", () => {
    expect(() => bantCriteriaVersionSchema.parse(bewiseBantV0)).not.toThrow();
  });

  it("rejects an authority status outside the document's vocabulary", () => {
    const invalid = {
      ...bewiseBantV0,
      criteria: {
        ...bewiseBantV0.criteria,
        qualificationRules: {
          ...bewiseBantV0.criteria.qualificationRules,
          qualified: {
            ...bewiseBantV0.criteria.qualificationRules.qualified,
            authority: ["ceo"],
          },
        },
      },
    };
    expect(() => bantCriteriaVersionSchema.parse(invalid)).toThrow();
  });
});
