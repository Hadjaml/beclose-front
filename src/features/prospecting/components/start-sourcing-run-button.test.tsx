import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import { StartSourcingRunButton } from "./start-sourcing-run-button";

const startMock = vi.hoisted(() => vi.fn());

vi.mock("../api/use-start-sourcing-run-mutation", () => ({
  useStartSourcingRunMutation: () => useMutation({ mutationFn: startMock }),
}));

function renderButton() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <StartSourcingRunButton workspaceId="workspace-1" />
    </QueryClientProvider>,
  );
}

describe("StartSourcingRunButton", () => {
  it("shows a confirmation message on success", async () => {
    const user = userEvent.setup();
    startMock.mockResolvedValueOnce(undefined);
    renderButton();

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    await waitFor(() =>
      expect(
        screen.getByText("Recherche lancée — les nouveaux prospects apparaîtront ici progressivement."),
      ).toBeInTheDocument(),
    );
  });

  it("shows a specific message when a run is already in progress (409)", async () => {
    const user = userEvent.setup();
    startMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "conflict",
        status: 409,
        details: { error: { code: "SOURCING_RUN_ALREADY_IN_PROGRESS", message: "…" } },
      }),
    );
    renderButton();

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    await waitFor(() =>
      expect(screen.getByText("Un sourcing est déjà en cours pour ce client.")).toBeInTheDocument(),
    );
  });

  it("shows a generic message for any other failure", async () => {
    const user = userEvent.setup();
    startMock.mockRejectedValueOnce(new ApiError({ kind: "network", message: "down" }));
    renderButton();

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    await waitFor(() =>
      expect(
        screen.getByText("Impossible de lancer le sourcing. Réessayez dans quelques instants."),
      ).toBeInTheDocument(),
    );
  });

  it("is disabled and says why when the ICP profile cannot source (audit A08)", async () => {
    const user = userEvent.setup();
    startMock.mockClear();
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <StartSourcingRunButton
          workspaceId="workspace-1"
          blocked={{
            reasons: ["Le profil ICP n’a aucun secteur prioritaire de rang 1 avec un libellé français."],
            fixHref: "/backoffice/clients/new?organization=workspace-1&step=icp",
          }}
        />
      </QueryClientProvider>,
    );

    const button = screen.getByRole("button", { name: "Lancer un sourcing" });
    expect(button).toBeDisabled();
    expect(screen.getByText(/aucun secteur prioritaire de rang 1/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Corriger le profil ICP" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=workspace-1&step=icp",
    );
    await user.click(button);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("explains a 422 SOURCING_PRECONDITION_FAILED with Beclose's blockers in French, and offers the fix", async () => {
    const user = userEvent.setup();
    startMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "unprocessable",
        status: 422,
        details: {
          error: {
            code: "SOURCING_PRECONDITION_FAILED",
            message: "Le sourcing ne peut pas démarrer.",
            details: { blockers: ["ICP_SECTOR_LABELS_MISSING", "NEW_CODE"] },
          },
        },
      }),
    );
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <StartSourcingRunButton workspaceId="workspace-1" fixHref="/backoffice/clients/new?organization=workspace-1&step=icp" />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Le sourcing ne peut pas démarrer");
    expect(alert).toHaveTextContent("n’ont aucun libellé français");
    expect(alert).toHaveTextContent("Précondition non remplie : NEW_CODE");
    expect(alert).not.toHaveTextContent("Impossible de lancer le sourcing");
    expect(screen.getByRole("link", { name: "Corriger le profil ICP" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=workspace-1&step=icp",
    );
  });

  it("a 422 without readable blockers still says the run cannot start, never the generic retry line", async () => {
    const user = userEvent.setup();
    startMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "unprocessable",
        status: 422,
        details: { error: { code: "SOURCING_PRECONDITION_FAILED", message: "Profil ICP inutilisable." } },
      }),
    );
    renderButton();

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Profil ICP inutilisable.");
  });

  it("explains 503 SOURCING_RUN_TRACKING_UNAVAILABLE: nothing was launched", async () => {
    const user = userEvent.setup();
    startMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "unavailable",
        status: 503,
        details: { error: { code: "SOURCING_RUN_TRACKING_UNAVAILABLE", message: "…" } },
      }),
    );
    renderButton();

    await user.click(screen.getByRole("button", { name: "Lancer un sourcing" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Aucun sourcing n’a été lancé");
    expect(alert).toHaveTextContent("suivi");
  });
});
