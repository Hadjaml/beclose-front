import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ClientProvisioningWizard } from "@/features/client-provisioning";

/**
 * Audit A06 (2026-09-24): reloading in the middle of the onboarding sent the
 * user back to "Créer une organisation" although the organization already
 * existed, and its Configuration page offered no way to finish. The step is
 * now derived from what Beclose holds for the organization named in the URL,
 * so a reload at any step resumes THE SAME organization.
 */
const configurationQueryMock = vi.hoisted(() => vi.fn());
const routerPush = vi.hoisted(() => vi.fn());
const routerReplace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: routerReplace }),
}));

vi.mock("@/features/client-configuration", async () => {
  const actual = await vi.importActual<typeof import("@/features/client-configuration")>(
    "@/features/client-configuration",
  );
  return {
    ...actual,
    useWorkspaceConfigurationQuery: configurationQueryMock,
  };
});

vi.mock("@/features/integrations", () => ({
  useWorkspaceIntegrationStatusQuery: () => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    data: { workspaceId: "org-1", google: null },
  }),
}));

function configuration(overrides: Partial<Record<"icpProfile" | "qualificationCriteria", unknown>> = {}) {
  return {
    isPending: false,
    isError: false,
    isSuccess: true,
    data: {
      workspaceId: "org-1",
      name: "Acme",
      pitch: null,
      signature: null,
      telegramChatId: "-100123",
      qualificationCriteria: null,
      icpProfile: null,
      ...overrides,
    },
  };
}

const someVersion = { version: 1, createdAt: "2026-09-24T00:00:00Z", criteria: {} };

function renderWizard(organizationId: string | null, requestedStep: "icp" | null = null) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ClientProvisioningWizard organizationId={organizationId} requestedStep={requestedStep} />
    </QueryClientProvider>,
  );
}

describe("ClientProvisioningWizard resumed from the URL", () => {
  beforeEach(() => {
    configurationQueryMock.mockReset();
    routerPush.mockClear();
    routerReplace.mockClear();
  });

  it("without an organization in the URL, starts at the organization step", () => {
    renderWizard(null);
    expect(screen.getByRole("heading", { name: "Créer une organisation" })).toBeInTheDocument();
    expect(configurationQueryMock).not.toHaveBeenCalled();
  });

  it("resumes at the ICP step when the organization exists with nothing configured", () => {
    configurationQueryMock.mockReturnValue(configuration());
    renderWizard("org-1");

    expect(screen.queryByRole("heading", { name: "Créer une organisation" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Créer le profil ICP" })).toBeInTheDocument();
    expect(configurationQueryMock).toHaveBeenCalledWith("org-1");
  });

  it("resumes at the BANT step when the ICP profile already exists", () => {
    configurationQueryMock.mockReturnValue(configuration({ icpProfile: { ...someVersion, name: "Profil ICP Acme" } }));
    renderWizard("org-1");

    expect(screen.getByRole("heading", { name: "Créer la grille BANT" })).toBeInTheDocument();
  });

  it("resumes at the connections step, with the stored Telegram group, when both policies exist", () => {
    configurationQueryMock.mockReturnValue(
      configuration({
        icpProfile: { ...someVersion, name: "Profil ICP Acme" },
        qualificationCriteria: someVersion,
      }),
    );
    renderWizard("org-1");

    expect(screen.getByRole("heading", { name: "Connexions" })).toBeInTheDocument();
    expect(screen.getByText("-100123")).toBeInTheDocument();
  });

  it("finishing the resumed onboarding opens the configuration of that same organization", async () => {
    configurationQueryMock.mockReturnValue(
      configuration({
        icpProfile: { ...someVersion, name: "Profil ICP Acme" },
        qualificationCriteria: someVersion,
      }),
    );
    renderWizard("org-1");

    await userEvent.click(screen.getByRole("button", { name: "Terminer" }));

    expect(routerPush).toHaveBeenCalledWith("/backoffice/workspaces/org-1/configuration");
  });

  it("names the failure and offers a retry when the organization cannot be loaded (never restarts from zero)", () => {
    const refetch = vi.fn();
    configurationQueryMock.mockReturnValue({ isPending: false, isError: true, isSuccess: false, refetch });
    renderWizard("org-1");

    expect(screen.getByText(/Impossible de charger cette organisation/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Créer une organisation" })).not.toBeInTheDocument();
  });

  it("step=icp asks for a new ICP version even when the profile exists (way out of an unusable profile, audit A08)", () => {
    configurationQueryMock.mockReturnValue(
      configuration({
        icpProfile: { ...someVersion, name: "Profil ICP Acme" },
        qualificationCriteria: someVersion,
      }),
    );
    renderWizard("org-1", "icp");

    expect(screen.getByRole("heading", { name: "Créer le profil ICP" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Connexions" })).not.toBeInTheDocument();
  });
});
