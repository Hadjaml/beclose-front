import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SourcingRunSection } from "./sourcing-run-section";

const configurationQueryMock = vi.hoisted(() => vi.fn());

vi.mock("@/shared/workspace/workspace-context", () => ({
  useWorkspace: () => ({ activeWorkspaceId: "org-1" }),
}));

vi.mock("@/features/client-configuration", async () => {
  const actual = await vi.importActual<typeof import("@/features/client-configuration")>(
    "@/features/client-configuration",
  );
  return { ...actual, useWorkspaceConfigurationQuery: configurationQueryMock };
});

function renderSection() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <SourcingRunSection />
    </QueryClientProvider>,
  );
}

const loaded = (sourcingReadiness: { ready: boolean; blockers: string[] } | null) => ({
  isSuccess: true,
  data: { icpProfile: {}, qualificationCriteria: {}, sourcingReadiness },
});

describe("SourcingRunSection (audit A08: no run known to fail)", () => {
  beforeEach(() => configurationQueryMock.mockReset());

  it("blocks the run when Beclose says the ICP cannot source", () => {
    configurationQueryMock.mockReturnValue(loaded({ ready: false, blockers: ["ICP_NO_PRIORITY_SECTORS"] }));
    renderSection();

    expect(screen.getByRole("button", { name: "Lancer un sourcing" })).toBeDisabled();
    expect(screen.getByText(/aucun secteur prioritaire de rang 1/)).toBeInTheDocument();
  });

  it("offers the run when Beclose says it is ready", () => {
    configurationQueryMock.mockReturnValue(loaded({ ready: true, blockers: [] }));
    renderSection();

    expect(screen.getByRole("button", { name: "Lancer un sourcing" })).toBeEnabled();
  });

  it("does not block on a configuration that is still loading, unreadable or without a verdict (Beclose stays the authority)", () => {
    configurationQueryMock.mockReturnValue({ isSuccess: false, data: undefined });
    renderSection();

    expect(screen.getByRole("button", { name: "Lancer un sourcing" })).toBeEnabled();
  });
});
