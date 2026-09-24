import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadProspectsApi } from "../api/lead-prospects-api";
import { LeadProspectDetailView } from "./lead-prospect-detail-view";

vi.mock("@/features/supervision", () => ({ MessageLogSection: () => null }));

const wire = {
  leadId: "lead-1",
  status: "booked",
  score: null,
  sourceLayer: "sourcing",
  identifiedAt: null,
  contactedAt: null,
  repliedAt: null,
  qualifiedAt: null,
  bookedAt: null,
  convertedAt: null,
  optedOutAt: null,
  bouncedAt: null,
  disqualifiedAt: null,
  handedOffAt: null,
  qualificationResult: "qualified",
  icpFit: null,
  handoffReason: null,
  nurtureFollowUpsSent: 0,
  company: { id: "c1", name: "Acme", siren: null, sector: null, headcount: null, source: "gouv" },
  contact: { id: "k1", fullName: null, email: "a@b.com", role: null, linkedinUrl: null, source: null },
  icpEvaluation: null,
  qualificationCriteria: { id: "g1", name: "Grille sur mesure", version: 1 },
  icpProfile: null,
  // Real Beclose wire shape, against a grid whose status_values are the
  // organization's own (not Bewise's).
  qualificationEvaluation: {
    budget: { status: "financement_acquis", evidence: [] },
    authority: { status: "comite_achat", evidence: [] },
    need: { status: "constructor", evidence: [] },
    timing: { status: "prochain_trimestre", evidence: [] },
    evaluated_at: "2026-09-24T10:00:00Z",
    schema_version: "1.0",
    criteria_version: 1,
  },
};

describe("LeadProspectDetailView — a lead evaluated against a custom BANT grid", () => {
  it("parses and shows each custom status as-is, none blank or undefined", async () => {
    const detail = await createLeadProspectsApi(fakeClient(() => ({ data: wire }))).getDetail("ws-1", "lead-1");

    render(<LeadProspectDetailView prospect={detail} />);

    expect(screen.getByText("financement_acquis")).toBeInTheDocument();
    expect(screen.getByText("comite_achat")).toBeInTheDocument();
    expect(screen.getByText("constructor")).toBeInTheDocument();
    expect(screen.getByText("prochain_trimestre")).toBeInTheDocument();
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });
});
