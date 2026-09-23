import { describe, expect, it } from "vitest";
import { icpCriteriaWireSchema } from "./icp-criteria-wire-schema";

const realWire = {
  schema_version: "1.0",
  profile_name: "Bewise ICP V0",
  purpose: "Cibler les PME B2B.",
  market: { business_model: ["B2B services"], geographies: ["France"], sales_motion: ["Outbound"] },
  company_fit: {
    employee_range: { min: 10, max: 150, hard_filter: false },
    annual_revenue: { preferred_min_eur: 500000, hard_filter: false },
    average_customer_value: { preferred_min_eur: 2000, hard_filter: false },
    validated_offer_required: true,
    existing_customers_required: true,
    human_closing_capacity_required: true,
  },
  priority_sectors: [{ tier: 1, sectors: ["commercial_cleaning"] }],
  commercial_maturity: {
    preferred_level: "M2",
    levels: { M2: "Structuré" },
    target_levels: ["M2"],
    preferred_levels: ["M2"],
    excluded_levels: [],
  },
  prospectability: {
    company_accounts_identifiable: true,
    decision_makers_identifiable: true,
    supported_channels: ["email"],
    need_discoverable_through_conversation: true,
    commercial_value_of_meeting_required: true,
    human_available_to_close_required: true,
  },
  decision_makers: { primary: ["Dirigeant"], secondary: [], potential_champions: [] },
  positive_signals: ["a"],
  negative_signals: ["b"],
  hard_disqualifiers: ["c"],
};

describe("icpCriteriaWireSchema", () => {
  it("parses the real Beclose wire shape (snake_case) and normalizes to camelCase", () => {
    const parsed = icpCriteriaWireSchema.parse(realWire);
    expect(parsed.schemaVersion).toBe("1.0");
    expect(parsed.profileName).toBe("Bewise ICP V0");
    expect(parsed.companyFit.employeeRange).toEqual({
      min: 10,
      max: 150,
      hardFilter: false,
      rejectBelow: null,
      rejectAbove: null,
    });
  });

  it("accepts employee_range with reject_below/reject_above (headcount tolerance)", () => {
    const withTolerance = {
      ...realWire,
      company_fit: {
        ...realWire.company_fit,
        employee_range: { min: 10, max: 150, hard_filter: false, reject_below: 5, reject_above: 300 },
      },
    };
    const parsed = icpCriteriaWireSchema.parse(withTolerance);
    expect(parsed.companyFit.employeeRange.rejectBelow).toBe(5);
    expect(parsed.companyFit.employeeRange.rejectAbove).toBe(300);
  });

  it("normalizes priority sectors given as plain strings or as {id, label_fr} objects", () => {
    const mixedSectors = {
      ...realWire,
      priority_sectors: [
        { tier: 1, sectors: ["plain_string_sector", { id: "with_label", label_fr: "Avec libellé" }] },
      ],
    };
    const parsed = icpCriteriaWireSchema.parse(mixedSectors);
    expect(parsed.prioritySectors[0]?.sectors).toEqual([
      { id: "plain_string_sector", labelFr: null },
      { id: "with_label", labelFr: "Avec libellé" },
    ]);
  });

  it("rejects a shape missing a required field", () => {
    const withoutPurpose: Record<string, unknown> = { ...realWire };
    delete withoutPurpose["purpose"];
    expect(() => icpCriteriaWireSchema.parse(withoutPurpose)).toThrow();
  });
});
