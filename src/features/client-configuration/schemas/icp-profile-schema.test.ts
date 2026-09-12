import { describe, expect, it } from "vitest";
import { icpProfileSchema } from "./icp-profile-schema";

// camelCase transcription of bewise_beclose_icp_bant_handoff.md §10's JSON
// example, wrapped in the versioned envelope (§3.1) - proves the schema
// accepts the actual target shape, not just something that compiles.
const bewiseIcpProfile = {
  id: "icp-1",
  organizationId: "org-bewise",
  name: "Bewise - Beclose ICP V0",
  version: 1,
  status: "active",
  supersedesId: null,
  createdAt: "2026-09-12T00:00:00Z",
  activatedAt: "2026-09-12T00:00:00Z",
  createdBy: "rochinel",
  notes: null,
  criteria: {
    schemaVersion: "1.0",
    market: {
      businessModel: ["B2B services", "B2B SaaS"],
      geographies: ["France"],
      salesMotion: ["consultative_sale", "appointment_led_sale"],
    },
    companyFit: {
      employeeRange: { min: 10, max: 150, hardFilter: false },
      annualRevenue: { preferredMinEur: 1_000_000, hardFilter: false },
      averageCustomerValue: {
        preferredMinEur: 5000,
        hardFilter: false,
        reason: "Un nouveau client doit avoir une valeur suffisamment élevée",
      },
      validatedOfferRequired: true,
      existingCustomersRequired: true,
      humanClosingCapacityRequired: true,
    },
    prioritySectors: [
      { tier: 1, sectors: ["commercial_cleaning", "facility_services"] },
      { tier: 2, sectors: ["B2B_consulting"] },
      { tier: 3, sectors: ["transport_logistics"] },
    ],
    commercialMaturity: {
      preferredLevel: "M2",
      targetLevels: ["M1", "M2", "M3"],
      preferredLevels: ["M2"],
      excludedLevels: ["M0"],
    },
    prospectability: {
      companyAccountsIdentifiable: true,
      decisionMakersIdentifiable: true,
      supportedChannels: ["email", "linkedin"],
      needDiscoverableThroughConversation: true,
      commercialValueOfMeetingRequired: true,
      humanAvailableToCloseRequired: true,
    },
    decisionMakers: {
      primary: ["Founder", "CEO", "VP Sales"],
      secondary: ["Head of Growth"],
      potentialChampions: ["Sales Manager"],
    },
    positiveSignals: ["Pipeline commercial irrégulier"],
    negativeSignals: ["Offre encore non validée commercialement"],
    hardDisqualifiers: ["no_validated_offer", "pure_B2C_business"],
  },
};

describe("icpProfileSchema", () => {
  it("accepts the source document's Bewise ICP V0 example", () => {
    expect(() => icpProfileSchema.parse(bewiseIcpProfile)).not.toThrow();
  });

  it("rejects an unknown commercial maturity level", () => {
    const invalid = {
      ...bewiseIcpProfile,
      criteria: {
        ...bewiseIcpProfile.criteria,
        commercialMaturity: {
          ...bewiseIcpProfile.criteria.commercialMaturity,
          preferredLevel: "M5",
        },
      },
    };
    expect(() => icpProfileSchema.parse(invalid)).toThrow();
  });
});
