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
