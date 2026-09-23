import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createWorkspaceConfigurationApi } from "./workspace-configuration-api";

/** Real wire shape of `qualification_criteria.criteria`
 * (`core.profiles.bant_schema.BantCriteria`, snake_case, not camelCased —
 * the JSONB blob passes through as stored). */
const bantCriteriaWire = {
  schema_version: "1.0",
  profile_name: "Bewise BANT V0",
  budget: {
    definition: "Le prospect a-t-il un budget identifiable ?",
    status_values: ["validated", "probable", "unknown", "insufficient"],
    positive_signals: ["Budget annoncé"],
    negative_signals: ["Refus de discuter budget"],
    questions: ["Quel budget avez-vous prévu ?"],
    explicit_amount_required: false,
  },
  authority: {
    definition: "Le contact peut-il décider ou influencer ?",
    status_values: ["decision_maker", "champion", "influencer", "unknown", "no_authority"],
    decision_maker_titles: ["CEO", "Dirigeant"],
    champion_titles: ["Responsable commercial"],
    questions: ["Qui décide en interne ?"],
  },
  need: {
    definition: "Le besoin est-il réel et exprimé ?",
    status_values: ["strong", "moderate", "weak", "none"],
    strong_signals: ["Recherche active de solution"],
    moderate_signals: ["Intérêt exprimé"],
    negative_signals: ["Aucun besoin exprimé"],
    disqualifiers: ["Déjà équipé et satisfait"],
    questions: ["Quel est votre besoin principal ?"],
  },
  timing: {
    definition: "Le prospect a-t-il un horizon de décision ?",
    status_values: ["0_90_days", "3_6_months", "over_6_months", "unknown"],
    qualified_horizon_days: 90,
    nurture_horizon_days: 180,
    questions: ["Quand comptez-vous avancer ?"],
    negative_signals: ["Aucun horizon défini"],
  },
  qualification_rules: {
    qualified: { need: ["strong"], timing: ["0_90_days"] },
    nurture: { need: ["moderate"], timing: ["3_6_months"] },
  },
  handoff_rules: {
    explicit_meeting_request: true,
    strong_need_and_human_request: true,
    strong_buying_intent: true,
  },
  nurture_rules: {
    max_follow_ups: 3,
    follow_up_delay_days: { "3_6_months": 30 },
  },
  conversation_policy: {
    avoid_interrogation_style: true,
    infer_before_asking: true,
    prefer_contextual_questions: true,
    explicit_budget_question_only_when_needed: true,
  },
};

/** Real wire shape of `icp_profiles.criteria`
 * (`core.profiles.icp_schema.IcpProfileCriteria`, snake_case). */
const icpCriteriaWire = {
  schema_version: "1.0",
  profile_name: "Bewise ICP V0",
  purpose: "Cibler les PME B2B avec un besoin de prospection outbound.",
  market: {
    business_model: ["B2B services"],
    geographies: ["France"],
    sales_motion: ["Outbound"],
  },
  company_fit: {
    employee_range: { min: 10, max: 150, hard_filter: false, reject_below: 5, reject_above: 300 },
    annual_revenue: { preferred_min_eur: 500000, hard_filter: false },
    average_customer_value: { preferred_min_eur: 2000, hard_filter: false, reason: "Panier rentable" },
    validated_offer_required: true,
    existing_customers_required: true,
    human_closing_capacity_required: true,
  },
  priority_sectors: [{ tier: 1, sectors: [{ id: "building_maintenance", label_fr: "Rénovation" }, "B2B_SaaS"] }],
  commercial_maturity: {
    preferred_level: "M2",
    levels: { M2: "Structuré" },
    target_levels: ["M1", "M2", "M3"],
    preferred_levels: ["M2"],
    excluded_levels: ["M0"],
  },
  prospectability: {
    company_accounts_identifiable: true,
    decision_makers_identifiable: true,
    supported_channels: ["email"],
    need_discoverable_through_conversation: true,
    commercial_value_of_meeting_required: true,
    human_available_to_close_required: true,
  },
  decision_makers: {
    primary: ["Dirigeant"],
    secondary: ["Responsable commercial"],
    potential_champions: ["Assistant de direction"],
  },
  positive_signals: ["Croissance récente"],
  negative_signals: ["Baisse d'effectif"],
  hard_disqualifiers: ["Liquidation judiciaire"],
};

describe("createWorkspaceConfigurationApi", () => {
  it("get() gets /organizations/{id}/configuration and maps organizationId to workspaceId", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/configuration");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          organizationId: "workspace-1",
          name: "Acme",
          pitch: "Pitch",
          signature: null,
          telegramChatId: null,
          qualificationCriteria: {
            version: 2,
            criteria: bantCriteriaWire,
            createdAt: "2026-01-01T00:00:00Z",
          },
          icpProfile: {
            name: "Bewise - Beclose ICP V0",
            version: 1,
            criteria: icpCriteriaWire,
            createdAt: "2026-01-01T00:00:00Z",
          },
        },
      };
    });

    const configuration = await createWorkspaceConfigurationApi(client).get("workspace-1");

    expect(configuration.workspaceId).toBe("workspace-1");
    expect(configuration.qualificationCriteria?.version).toBe(2);
    expect(configuration.qualificationCriteria?.criteria.budget.statusValues).toEqual([
      "validated",
      "probable",
      "unknown",
      "insufficient",
    ]);
    expect(configuration.qualificationCriteria?.criteria.need.strongSignals).toEqual([
      "Recherche active de solution",
    ]);
    expect(configuration.qualificationCriteria?.criteria.authority).not.toHaveProperty("positiveSignals");
    expect(configuration.qualificationCriteria?.criteria.nurtureRules?.maxFollowUps).toBe(3);
    expect(configuration.icpProfile?.name).toBe("Bewise - Beclose ICP V0");
    expect(configuration.icpProfile?.criteria.companyFit.employeeRange.rejectBelow).toBe(5);
    expect(configuration.icpProfile?.criteria.prioritySectors[0]?.sectors).toEqual([
      { id: "building_maintenance", labelFr: "Rénovation" },
      { id: "B2B_SaaS", labelFr: null },
    ]);
  });

  it("get() accepts a null qualificationCriteria and a null icpProfile", async () => {
    const client = fakeClient(() => ({
      data: {
        organizationId: "workspace-1",
        name: "Acme",
        pitch: null,
        signature: null,
        telegramChatId: null,
        qualificationCriteria: null,
        icpProfile: null,
      },
    }));

    const configuration = await createWorkspaceConfigurationApi(client).get("workspace-1");

    expect(configuration.qualificationCriteria).toBeNull();
    expect(configuration.icpProfile).toBeNull();
  });

  it("get() accepts a qualificationCriteria without optional nurture_rules/custom_criteria", async () => {
    const bantWithoutOptionals: Record<string, unknown> = { ...bantCriteriaWire };
    delete bantWithoutOptionals["nurture_rules"];
    const client = fakeClient(() => ({
      data: {
        organizationId: "workspace-1",
        name: "Acme",
        pitch: null,
        signature: null,
        telegramChatId: null,
        qualificationCriteria: {
          version: 1,
          criteria: bantWithoutOptionals,
          createdAt: "2026-01-01T00:00:00Z",
        },
        icpProfile: null,
      },
    }));

    const configuration = await createWorkspaceConfigurationApi(client).get("workspace-1");

    expect(configuration.qualificationCriteria?.criteria.nurtureRules).toBeNull();
  });

  it("createIcpProfileVersion() posts /organizations/{id}/icp-profile and returns the version summary", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/icp-profile");
      expect(options.method).toBe("POST");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          id: "icp-1",
          name: "Profil ICP V1",
          version: 1,
          status: "active",
          activatedAt: "2026-09-23T00:00:00Z",
          createdAt: "2026-09-23T00:00:00Z",
        },
      };
    });

    const result = await createWorkspaceConfigurationApi(client).createIcpProfileVersion("workspace-1", {
      name: "Profil ICP V1",
      notes: null,
      criteria: {} as never,
    });

    expect(result.id).toBe("icp-1");
    expect(result.status).toBe("active");
  });

  it("createBantCriteriaVersion() posts /organizations/{id}/bant-criteria and returns the version summary", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/bant-criteria");
      expect(options.method).toBe("POST");
      return {
        data: {
          id: "bant-1",
          name: "Grille BANT V1",
          version: 1,
          status: "active",
          activatedAt: "2026-09-23T00:00:00Z",
          createdAt: "2026-09-23T00:00:00Z",
        },
      };
    });

    const result = await createWorkspaceConfigurationApi(client).createBantCriteriaVersion("workspace-1", {
      name: "Grille BANT V1",
      notes: null,
      criteria: {} as never,
    });

    expect(result.id).toBe("bant-1");
  });
});
