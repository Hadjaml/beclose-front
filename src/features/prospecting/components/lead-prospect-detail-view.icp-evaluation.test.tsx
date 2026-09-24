import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadProspectsApi } from "../api/lead-prospects-api";
import { LeadProspectDetailView } from "./lead-prospect-detail-view";

vi.mock("@/features/supervision", () => ({ MessageLogSection: () => null }));

const base = {
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
  icpFit: "weak",
  handoffReason: null,
  nurtureFollowUpsSent: 0,
  company: { id: "c1", name: "Acme", siren: null, sector: null, headcount: null, source: "gouv" },
  contact: { id: "k1", fullName: null, email: "a@b.com", role: null, linkedinUrl: null, source: null },
  qualificationCriteria: null,
  icpProfile: null,
  qualificationEvaluation: null,
};

/** Real snake_case shape Beclose now writes once a prospect replies (B06). */
const icpEvaluation = {
  profile_id: "p1",
  profile_version: 3,
  evaluated_at: "2026-09-24T10:00:00Z",
  verdict: "weak",
  verdict_basis: ["negative_outweighs_positive", "brand_new_code"],
  positive_signals: [{ signal: "Croissance récente", evidence: [{ text: "On recrute 5 commerciaux", source_interaction_id: "msg-9" }] }],
  negative_signals: [{ signal: "Baisse d'effectif", evidence: [{ text: "On a dû réduire l'équipe" }] }],
  hard_disqualifiers: [],
  commercial_maturity: { level: "M1", evidence: [{ text: "Le dirigeant prospecte seul" }] },
};

async function detail(over: Record<string, unknown> = {}) {
  return createLeadProspectsApi(fakeClient(() => ({ data: { ...base, icpEvaluation, ...over } }))).getDetail("ws-1", "lead-1");
}

describe("LeadProspectDetailView — per-lead ICP evaluation (B06)", () => {
  it("parses Beclose's real evaluation without failing the page, and shows verdict, version and date", async () => {
    render(<LeadProspectDetailView prospect={await detail()} />);

    const section = screen.getByRole("region", { name: "Évaluation ICP" });
    expect(within(section).getByText(/Adéquation : Faible/)).toBeInTheDocument();
    expect(within(section).getByText(/version 3/)).toBeInTheDocument();
    expect(within(section).getByText(/24 septembre 2026/)).toBeInTheDocument();
  });

  it("explains the verdict in French, and stays neutral on a basis code it does not know", async () => {
    render(<LeadProspectDetailView prospect={await detail()} />);

    expect(screen.getByText(/signaux négatifs l’emportent sur les signaux positifs/)).toBeInTheDocument();
    expect(screen.getByText("Motif inconnu : brand_new_code")).toBeInTheDocument();
  });

  it("shows each signal with its cited evidence, and links the source message when there is one", async () => {
    render(<LeadProspectDetailView prospect={await detail()} />);

    expect(screen.getByText("Croissance récente")).toBeInTheDocument();
    expect(screen.getByText(/On recrute 5 commerciaux/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir le message source/ })).toHaveAttribute("href", "#message-msg-9");
    expect(screen.getByText("Baisse d'effectif")).toBeInTheDocument();
    expect(screen.getByText(/Le dirigeant prospecte seul/)).toBeInTheDocument();
    expect(screen.getByText(/Maturité commerciale : M1/)).toBeInTheDocument();
  });

  it("explains a qualified BANT with a weak ICP fit, and that the ICP verdict never changes the lead status", async () => {
    render(<LeadProspectDetailView prospect={await detail()} />);

    expect(screen.getByText(/qualifié selon la grille BANT, mais son adéquation ICP est faible/)).toBeInTheDocument();
    expect(screen.getByText(/ne change jamais le statut/)).toBeInTheDocument();
  });

  it("nothing proven yet (icpFit null, evaluation null) reads as not evaluated", async () => {
    render(<LeadProspectDetailView prospect={await detail({ icpFit: null, icpEvaluation: null })} />);

    expect(screen.queryByRole("region", { name: "Évaluation ICP" })).not.toBeInTheDocument();
    expect(screen.getByText("Non évalué")).toBeInTheDocument();
  });

  it("an unknown verdict is stated as unknown, not guessed", async () => {
    render(<LeadProspectDetailView prospect={await detail({ icpEvaluation: { ...icpEvaluation, verdict: "brand_new" } })} />);
    expect(screen.getByText(/Adéquation inconnue : brand_new/)).toBeInTheDocument();
  });

  it("still parses the older shapes (reasons list)", async () => {
    render(
      <LeadProspectDetailView
        prospect={await detail({ icpEvaluation: { fit: "strong", reasons: ["Secteur ciblé"] } })}
      />,
    );
    expect(screen.getByText("Secteur ciblé")).toBeInTheDocument();
  });
});
