import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ClientSetupStatus } from "./client-setup-status";

const configurationQueryMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/client-configuration", async () => {
  const actual = await vi.importActual<typeof import("@/features/client-configuration")>(
    "@/features/client-configuration",
  );
  return { ...actual, useWorkspaceConfigurationQuery: configurationQueryMock };
});

function renderStatus() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ClientSetupStatus workspaceId="org-1" />
    </QueryClientProvider>,
  );
}

const labelled = { criteria: { prioritySectors: [{ tier: 1, sectors: [{ id: "s", labelFr: "Conseil" }] }] } };
const loaded = (icpProfile: unknown, qualificationCriteria: unknown) => ({
  isSuccess: true,
  data: { icpProfile, qualificationCriteria },
});

describe("ClientSetupStatus (audit A06: an unfinished client is never shown as configured)", () => {
  beforeEach(() => configurationQueryMock.mockReset());

  it("flags an incomplete configuration and links to resume the same organization", () => {
    configurationQueryMock.mockReturnValue(loaded(null, null));
    renderStatus();

    expect(screen.getByText("Configuration incomplète")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reprendre" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1",
    );
  });

  it("flags an ICP profile that cannot source", () => {
    configurationQueryMock.mockReturnValue(loaded({ criteria: { prioritySectors: [] } }, {}));
    renderStatus();

    expect(screen.getByText("Sourcing impossible : profil ICP sans secteur exploitable")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Corriger" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1&step=icp",
    );
  });

  it("shows nothing for a fully configured client", () => {
    configurationQueryMock.mockReturnValue(loaded(labelled, {}));
    renderStatus();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/incomplète|impossible/)).not.toBeInTheDocument();
  });

  it("shows nothing while loading or when the configuration cannot be read (never breaks the list)", () => {
    configurationQueryMock.mockReturnValue({ isSuccess: false, data: undefined });
    renderStatus();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
