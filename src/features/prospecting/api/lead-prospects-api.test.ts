import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadProspectsApi } from "./lead-prospects-api";

const prospectWire = {
  leadId: "lead-1",
  status: "identified",
  score: null,
  sourceLayer: "sourcing",
  identifiedAt: "2026-01-01T00:00:00Z",
  contactedAt: null,
  repliedAt: null,
  qualifiedAt: null,
  bookedAt: null,
  convertedAt: null,
  optedOutAt: null,
  bouncedAt: null,
  disqualifiedAt: null,
  handedOffAt: null,
  qualificationResult: null,
  icpFit: null,
  handoffReason: null,
  nurtureFollowUpsSent: 0,
  company: {
    id: "company-1",
    name: "Acme",
    siren: null,
    sector: null,
    headcount: null,
    source: "gouv",
  },
  contact: {
    id: "contact-1",
    fullName: null,
    email: "a@b.com",
    role: null,
    linkedinUrl: null,
    source: null,
  },
};

describe("createLeadProspectsApi", () => {
  it("list() gets /organizations/{id}/prospects with a status filter and pagination", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/prospects");
      expect(options.method).toBe("GET");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      expect(options.query).toEqual({ status: "identified", limit: 10, offset: 0 });
      return { data: [prospectWire], pagination: { limit: 10, offset: 0, total: 1 } };
    });

    const page = await createLeadProspectsApi(client).list("workspace-1", {
      status: "identified",
      limit: 10,
      offset: 0,
    });

    expect(page.data).toHaveLength(1);
    expect(page.data[0]?.leadId).toBe("lead-1");
    expect(page.data[0]?.company.name).toBe("Acme");
    expect(page.pagination).toEqual({ limit: 10, offset: 0, total: 1 });
  });

  it("list() works without an explicit query (no filter)", async () => {
    const client = fakeClient((_path, options) => {
      expect(options.query).toEqual({ status: undefined, limit: undefined, offset: undefined });
      return { data: [], pagination: { limit: 50, offset: 0, total: 0 } };
    });

    const page = await createLeadProspectsApi(client).list("workspace-1");

    expect(page.data).toEqual([]);
  });

  it("list() carries the real qualification/handoff fields through when set", async () => {
    const client = fakeClient(() => ({
      data: [
        {
          ...prospectWire,
          status: "handed_off",
          handedOffAt: "2026-01-02T00:00:00Z",
          qualificationResult: "qualified",
          handoffReason: "strong_need_signal",
          nurtureFollowUpsSent: 2,
        },
      ],
      pagination: { limit: 50, offset: 0, total: 1 },
    }));

    const page = await createLeadProspectsApi(client).list("workspace-1");

    expect(page.data[0]?.qualificationResult).toBe("qualified");
    expect(page.data[0]?.handoffReason).toBe("strong_need_signal");
    expect(page.data[0]?.nurtureFollowUpsSent).toBe(2);
  });

  it("getDetail() gets /organizations/{id}/prospects/{leadId} with the two evaluations", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/prospects/lead-1");
      expect(options.method).toBe("GET");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          ...prospectWire,
          icpEvaluation: null,
          qualificationEvaluation: {
            qualificationCriteriaId: "bant-1",
            qualificationCriteriaVersion: 1,
            budget: { status: "probable", evidence: "Utilise une agence" },
            authority: { status: "decision_maker" },
            need: { status: "strong", sourceInteractionId: "interaction-1" },
            timing: { status: "0_90_days" },
            result: "qualified",
          },
          qualificationCriteria: { id: "bant-1", name: "Bewise BANT V0", version: 1 },
          icpProfile: null,
        },
      };
    });

    const detail = await createLeadProspectsApi(client).getDetail("workspace-1", "lead-1");

    expect(detail.leadId).toBe("lead-1");
    expect(detail.icpEvaluation).toBeNull();
    expect(detail.qualificationEvaluation?.result).toBe("qualified");
    expect(detail.qualificationEvaluation?.need.sourceInteractionId).toBe("interaction-1");
    expect(detail.qualificationCriteria?.name).toBe("Bewise BANT V0");
    expect(detail.icpProfile).toBeNull();
  });

  it("getDetail() handles real Beclose wire shape for qualificationEvaluation", async () => {
    const client = fakeClient(() => ({
      data: {
        ...prospectWire,
        icpEvaluation: null,
        qualificationEvaluation: {
          need: {
            status: "weak",
            evidence: [
              {
                text: "D’accord je suis ouvert pour en discuter avec vous à ce sujet",
                source_interaction_id: "interaction-need-1",
              },
            ],
          },
          budget: { status: "unknown", evidence: [] },
          timing: {
            status: "0_90_days",
            evidence: [
              {
                text: "Parfait, à vendredi !",
                source_interaction_id: "interaction-timing-1",
              },
            ],
          },
          authority: { status: "unknown", evidence: [] },
          evaluated_at: "2026-09-17T10:37:23.082881Z",
          schema_version: "1.0",
          handoff_signals: { explicit_meeting_request: true },
          criteria_version: 2,
        },
        qualificationCriteria: { id: "bant-1", name: "Bewise BANT V0", version: 2 },
        icpProfile: null,
      },
    }));

    const detail = await createLeadProspectsApi(client).getDetail("workspace-1", "lead-1");

    expect(detail.qualificationEvaluation?.need.status).toBe("weak");
    expect(detail.qualificationEvaluation?.need.evidence).toBe(
      "D’accord je suis ouvert pour en discuter avec vous à ce sujet",
    );
    expect(detail.qualificationEvaluation?.need.sourceInteractionId).toBe("interaction-need-1");
    expect(detail.qualificationEvaluation?.timing.status).toBe("0_90_days");
    expect(detail.qualificationEvaluation?.timing.evidence).toBe("Parfait, à vendredi !");
    expect(detail.qualificationEvaluation?.timing.sourceInteractionId).toBe("interaction-timing-1");
    expect(detail.qualificationEvaluation?.budget.status).toBe("unknown");
    expect(detail.qualificationEvaluation?.budget.evidence).toBeUndefined();
    expect(detail.qualificationEvaluation?.budget.sourceInteractionId).toBeUndefined();
  });

  it("getDetail() handles real Beclose wire shape for Nanfa (icpEvaluation and qualificationEvaluation)", async () => {
    const client = fakeClient(() => ({
      data: {
        ...prospectWire,
        leadId: "b27f499e-e78a-45b5-a01f-905c0690d874",
        status: "handed_off",
        handedOffAt: "2026-09-17T13:01:13.601299Z",
        qualificationResult: "not_qualified",
        icpFit: "strong",
        handoffReason: "strong_need_signal",
        company: {
          id: "company-nanfa",
          name: "Nanfa Rénovation Immobilière",
          siren: null,
          sector: "Rénovation immobilière et aménagement B2B",
          headcount: 12,
          source: "sourcing",
        },
        contact: {
          id: "contact-nanfa",
          fullName: "Bienvenu Nanfa",
          email: "bienvenunanfa@gmail.com",
          role: "Dirigeant",
          linkedinUrl: null,
          source: "sourcing",
        },
        icpEvaluation: {
          fit: "strong",
          tier: 1,
          sector: "building_maintenance",
          reasons: [
            "Entreprise de rénovation et aménagement immobilier",
            "Effectif de 12 salariés dans la cible prioritaire (10-150)",
            "Dirigeant identifié (décideur direct)",
          ],
        },
        qualificationEvaluation: {
          need: {
            status: "strong",
            evidence: [
              {
                text: "La recherche des nouveau chantier...",
                source_interaction_id: "interaction-need-1",
              },
            ],
          },
          budget: { status: "unknown", evidence: [] },
          timing: {
            status: "0_90_days",
            evidence: [
              {
                text: "Je serais intéressé...",
                source_interaction_id: "interaction-timing-1",
              },
            ],
          },
          authority: { status: "unknown", evidence: [] },
          evaluated_at: "2026-09-17T13:01:13.599298Z",
          schema_version: "1.0",
          handoff_signals: { strong_buying_intent: true },
          criteria_version: 2,
        },
        qualificationCriteria: {
          id: "c1d7e613-062c-458a-ae20-b95b5e9064fb",
          name: "Bewise BANT V0 + nurture_rules (étape 5e)",
          version: 2,
        },
        icpProfile: {
          id: "76584628-e605-423a-bdcf-150a6c00bdce",
          name: "Bewise ICP V0 + tolérance d'effectif (revue de clôture)",
          version: 3,
        },
      },
    }));

    const detail = await createLeadProspectsApi(client).getDetail("workspace-1", "b27f499e-e78a-45b5-a01f-905c0690d874");

    expect(detail.company.name).toBe("Nanfa Rénovation Immobilière");
    expect(detail.status).toBe("handed_off");
    expect(detail.handoffReason).toBe("strong_need_signal");
    expect(detail.icpFit).toBe("strong");
    expect(detail.icpProfile?.name).toBe("Bewise ICP V0 + tolérance d'effectif (revue de clôture)");
    expect(detail.icpEvaluation?.fit).toBe("strong");
    if (detail.icpEvaluation && "reasons" in detail.icpEvaluation) {
      expect(detail.icpEvaluation.reasons).toHaveLength(3);
    }
    expect(detail.qualificationEvaluation?.need.status).toBe("strong");
  });

  it("getDetail() handles real Beclose wire shape for ML-HANDC (icpEvaluation present, qualificationEvaluation null)", async () => {
    const client = fakeClient(() => ({
      data: {
        ...prospectWire,
        leadId: "c3fbfcf6-e950-4f44-956a-85d494d2a14c",
        status: "contacted",
        contactedAt: "2026-09-17T13:19:51.802369Z",
        qualificationResult: null,
        icpFit: "strong",
        handoffReason: null,
        company: {
          id: "company-ml",
          name: "ML-HANDC",
          siren: null,
          sector: "Édition de logiciels SaaS B2B & FoodTech",
          headcount: 6,
          source: "sourcing",
        },
        contact: {
          id: "contact-ml",
          fullName: "Hadja Traore",
          email: "hadja@ml-handc.com",
          role: "Fondatrice & CEO",
          linkedinUrl: null,
          source: "sourcing",
        },
        icpEvaluation: {
          fit: "strong",
          tier: 2,
          sector: "B2B_SaaS",
          reasons: [
            "Éditeur de logiciels SaaS B2B dédié à la restauration",
            "Effectif de 6 salariés (fourchette cible)",
            "Fondatrice & CEO identifiée comme décisionnaire direct",
            "Besoin fort de prospection outbound auprès des restaurateurs",
          ],
        },
        qualificationEvaluation: null,
        qualificationCriteria: {
          id: "c1d7e613-062c-458a-ae20-b95b5e9064fb",
          name: "Bewise BANT V0 + nurture_rules (étape 5e)",
          version: 2,
        },
        icpProfile: {
          id: "76584628-e605-423a-bdcf-150a6c00bdce",
          name: "Bewise ICP V0 + tolérance d'effectif (revue de clôture)",
          version: 3,
        },
      },
    }));

    const detail = await createLeadProspectsApi(client).getDetail("workspace-1", "c3fbfcf6-e950-4f44-956a-85d494d2a14c");

    expect(detail.company.name).toBe("ML-HANDC");
    expect(detail.status).toBe("contacted");
    expect(detail.icpFit).toBe("strong");
    expect(detail.qualificationEvaluation).toBeNull();
    expect(detail.icpProfile?.name).toBe("Bewise ICP V0 + tolérance d'effectif (revue de clôture)");
    if (detail.icpEvaluation && "reasons" in detail.icpEvaluation) {
      expect(detail.icpEvaluation.reasons).toHaveLength(4);
    }
  });

  it("setOutcome() PUTs the outcome and returns the updated prospect detail", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/prospects/lead-1/outcome");
      expect(options.method).toBe("PUT");
      expect(options.body).toEqual({ outcome: "won" });
      return {
        data: {
          ...prospectWire,
          status: "converted",
          outcome: "won",
          outcomeAt: "2026-09-24T10:00:00Z",
          icpEvaluation: null,
          qualificationEvaluation: null,
          qualificationCriteria: null,
          icpProfile: null,
        },
      };
    });

    const detail = await createLeadProspectsApi(client).setOutcome("workspace-1", "lead-1", "won");

    expect(detail.status).toBe("converted");
    expect(detail.outcome).toBe("won");
  });

  it("defaults outcome to null when the API predates outcomes", async () => {
    const client = fakeClient(() => ({
      data: {
        ...prospectWire,
        icpEvaluation: null,
        qualificationEvaluation: null,
        qualificationCriteria: null,
        icpProfile: null,
      },
    }));
    const detail = await createLeadProspectsApi(client).getDetail("workspace-1", "lead-1");
    expect(detail.outcome).toBeNull();
    expect(detail.outcomeAt).toBeNull();
  });
});
