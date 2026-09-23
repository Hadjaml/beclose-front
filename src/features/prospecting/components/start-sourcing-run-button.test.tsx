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
});
