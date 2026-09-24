import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sourcingRunSchema } from "../schemas/sourcing-run-schema";
import { SourcingRunsList } from "./sourcing-runs-list";

const base = {
  id: "run-1",
  startedAt: "2026-09-24T09:00:00Z",
  finishedAt: null,
  errorMessage: null,
  report: null,
};

describe("SourcingRunsList", () => {
  it("says so when no sourcing was ever launched", () => {
    render(<SourcingRunsList runs={[]} />);
    expect(screen.getByText(/Aucun sourcing lancé/)).toBeInTheDocument();
  });

  it("shows a running run with the reassurance that leads arrive progressively", () => {
    render(<SourcingRunsList runs={[sourcingRunSchema.parse({ ...base, status: "running" })]} />);
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText(/au fil de l’eau/)).toBeInTheDocument();
  });

  it("shows the per-step breakdown of a finished run", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "succeeded",
            finishedAt: "2026-09-24T09:30:00Z",
            report: { companies_found: 20, companies_with_domain: 8, companies_without_domain: 10, companies_with_email: 3, companies_without_email: 5, email_coverage_rate: 0.15 },
          }),
        ]}
      />,
    );
    expect(screen.getByText("Terminé")).toBeInTheDocument();
    expect(screen.getByText("sans site officiel trouvé")).toBeInTheDocument();
    expect(screen.getByText("15 %")).toBeInTheDocument();
  });

  it("shows the cause of a failed run, and a restart-killed run as interrupted", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({ ...base, id: "a", status: "failed", errorMessage: "ValueError: boom" }),
          sourcingRunSchema.parse({ ...base, id: "b", status: "failed", errorMessage: "interrompu" }),
        ]}
      />,
    );
    expect(screen.getByText("Échoué")).toBeInTheDocument();
    expect(screen.getByText(/ValueError: boom/)).toBeInTheDocument();
    expect(screen.getByText("Interrompu")).toBeInTheDocument();
  });
});

describe("SourcingRunsList — status vocabulary drift", () => {
  it("still lists every run, labelling an unknown status neutrally", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({ ...base, id: "a", status: "running" }),
          sourcingRunSchema.parse({ ...base, id: "b", status: "some_future_status" }),
        ]}
      />,
    );
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Statut inconnu : some_future_status")).toBeInTheDocument();
  });
});

describe("SourcingRunsList — live progress and partial reports (lot 3)", () => {
  it("shows the stage, the last sign of life and the live counters of a running run", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "running",
            stage: "processing",
            lastProgressAt: "2026-09-24T09:12:00Z",
            report: { companies_consulted: 40, pages_fetched: 2, companies_found: 12, companies_with_email: 3 },
          }),
        ]}
      />,
    );

    expect(screen.getByText("Traitement des entreprises")).toBeInTheDocument();
    expect(screen.getByText(/Dernier signe de vie/)).toBeInTheDocument();
    expect(screen.getByText("Candidats examinés")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("Pages consultées")).toBeInTheDocument();
  });

  it("never invents a 0 % coverage for a live report that does not carry it", () => {
    render(
      <SourcingRunsList
        runs={[sourcingRunSchema.parse({ ...base, status: "running", report: { companies_found: 1 } })]}
      />,
    );
    expect(screen.queryByText(/Taux de couverture/)).not.toBeInTheDocument();
  });

  it("says why the run stopped, in French, and stays neutral on an unknown reason", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({ ...base, id: "a", status: "succeeded", report: { stop_reason: "results_exhausted" } }),
          sourcingRunSchema.parse({ ...base, id: "b", status: "succeeded", report: { stop_reason: "page_budget_exhausted" } }),
          sourcingRunSchema.parse({ ...base, id: "c", status: "succeeded", report: { stop_reason: "brand_new" } }),
        ]}
      />,
    );
    expect(screen.getByText(/Résultats de la source épuisés/)).toBeInTheDocument();
    expect(screen.getByText(/Limite de pages atteinte/)).toBeInTheDocument();
    expect(screen.getByText(/Raison d’arrêt inconnue : brand_new/)).toBeInTheDocument();
  });

  it("labels the report of a failed run as partial, and keeps its figures", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "failed",
            errorMessage: "Run sans progression depuis plus de 20 minutes",
            report: { companies_found: 7, companies_consulted: 15 },
          }),
        ]}
      />,
    );
    expect(screen.getByText(/Bilan partiel/)).toBeInTheDocument();
    expect(screen.getByText("Candidats examinés")).toBeInTheDocument();
    expect(screen.getByText(/sans progression depuis plus de 20 minutes/)).toBeInTheDocument();
  });

  it("shows the enrichment retry of already-known companies only when reported", () => {
    render(
      <SourcingRunsList
        runs={[sourcingRunSchema.parse({ ...base, status: "succeeded", report: { companies_retried: 5, companies_recovered: 2 } })]}
      />,
    );
    expect(screen.getByText(/Entreprises connues re-tentées/)).toBeInTheDocument();
    expect(screen.getByText(/dont récupérées/)).toBeInTheDocument();
  });

  it("a stage Beclose adds later degrades to a neutral label, never a failure", () => {
    render(
      <SourcingRunsList
        runs={[sourcingRunSchema.parse({ ...base, status: "running", stage: "warming_up" })]}
      />,
    );
    expect(screen.getByText("Étape inconnue : warming_up")).toBeInTheDocument();
  });
});

describe("SourcingRunsList — Hunter quota", () => {
  it("shows a reached Hunter quota as a normal stop reason, not as a failure, with the calls counter", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "succeeded",
            report: { stop_reason: "hunter_budget_exhausted", hunter_calls: 25, companies_found: 9 },
          }),
        ]}
      />,
    );

    expect(
      screen.getByText(/Quota Hunter atteint pour ce run, les entreprises restantes seront reprises au prochain/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/inconnue/)).not.toBeInTheDocument();
    expect(screen.getByText("Appels Hunter")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
  });

  it("does not show a Hunter counter a report does not carry", () => {
    render(<SourcingRunsList runs={[sourcingRunSchema.parse({ ...base, status: "succeeded", report: { companies_found: 1 } })]} />);
    expect(screen.queryByText("Appels Hunter")).not.toBeInTheDocument();
  });
});

describe("SourcingRunsList — geography applied to the run (B04)", () => {
  it("says what zone was really applied to THIS run, and where it came from", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "succeeded",
            report: { geography: { status: "restricted", source: "icp", regions: ["53"], departements: [], unrecognized: [] } },
          }),
        ]}
      />,
    );
    expect(screen.getByText(/Zone appliquée : régions \(codes INSEE\) 53/)).toBeInTheDocument();
    expect(screen.getByText(/profil ICP/)).toBeInTheDocument();
  });

  it("warns when the zone was not applied", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({
            ...base,
            status: "succeeded",
            report: { geography: { status: "unsupported", source: "icp", regions: [], departements: [], unrecognized: ["Lyon"] } },
          }),
        ]}
      />,
    );
    expect(screen.getByText(/La zone de l’ICP \(Lyon\) n’est pas appliquée/)).toBeInTheDocument();
  });

  it("shows nothing about geography for a report that does not carry it, and stays neutral on an unknown source", () => {
    render(
      <SourcingRunsList
        runs={[
          sourcingRunSchema.parse({ ...base, id: "a", status: "succeeded", report: { companies_found: 1 } }),
          sourcingRunSchema.parse({
            ...base,
            id: "b",
            status: "succeeded",
            report: { geography: { status: "national", source: "moon", regions: [], departements: [], unrecognized: [] } },
          }),
        ]}
      />,
    );
    expect(screen.getAllByText(/aucun filtre géographique/)).toHaveLength(1);
    expect(screen.getByText(/source inconnue : moon/i)).toBeInTheDocument();
  });
});
