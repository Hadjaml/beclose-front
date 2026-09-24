import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { leadProspectSchema } from "../schemas/lead-prospect-schema";
import { LeadProspectsList } from "./lead-prospects-list";

const base = {
  leadId: "lead-1",
  status: "handed_off",
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
  qualificationResult: null,
  icpFit: null,
  handoffReason: null,
  nurtureFollowUpsSent: 0,
  company: { id: "c1", name: "Acme", siren: null, sector: null, headcount: null, source: "gouv" },
  contact: { id: "k1", fullName: null, email: "a@b.com", role: null, linkedinUrl: null, source: null },
};

describe("LeadProspectsList — vocabulary drift", () => {
  it("keeps every row, and shows an unknown handoff reason neutrally (not green, not red)", () => {
    render(
      <LeadProspectsList
        workspaceId="ws-1"
        prospects={[
          leadProspectSchema.parse({ ...base, handoffReason: "strong_need_signal" }),
          leadProspectSchema.parse({ ...base, leadId: "lead-2", company: { ...base.company, id: "c2", name: "Beta" }, handoffReason: "future_reason", qualificationResult: "future_result" }),
          leadProspectSchema.parse({ ...base, leadId: "lead-3", company: { ...base.company, id: "c3", name: "Gamma" }, status: "future_status" }),
        ]}
      />,
    );

    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();

    const known = screen.getByText("Besoin fort détecté (transfert anticipé)");
    expect(known.className).toContain("emerald");

    const unknown = screen.getByText("Motif inconnu : future_reason");
    expect(unknown.className).not.toContain("emerald");
    expect(unknown.className).not.toContain("red");

    expect(screen.getByText("Résultat inconnu : future_result")).toBeInTheDocument();
    expect(screen.getByText("Statut inconnu : future_status")).toBeInTheDocument();
  });
});
