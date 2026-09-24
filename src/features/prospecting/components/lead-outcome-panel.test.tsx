import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import type { LeadOutcome, LeadStatus } from "../model/lead-prospect";
import { LeadOutcomePanel } from "./lead-outcome-panel";

const setOutcomeMock = vi.hoisted(() => vi.fn());

vi.mock("../api/use-set-lead-outcome-mutation", () => ({
  useSetLeadOutcomeMutation: () => useMutation({ mutationFn: setOutcomeMock }),
}));

function renderPanel(status: LeadStatus, outcome: LeadOutcome | null = null, outcomeAt: string | null = null) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <LeadOutcomePanel workspaceId="ws-1" leadId="lead-1" status={status} outcome={outcome} outcomeAt={outcomeAt} />
    </QueryClientProvider>,
  );
}

describe("LeadOutcomePanel", () => {
  it("renders nothing for a lead that was never transmitted", () => {
    const { container } = renderPanel("replied");
    expect(container).toBeEmptyDOMElement();
  });

  it("offers both actions on a transmitted lead with no outcome yet", () => {
    renderPanel("handed_off");
    expect(screen.getByText("Aucune issue déclarée pour l’instant.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marquer gagné" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marquer perdu" })).toBeInTheDocument();
  });

  it("shows an already-declared outcome, and no action once it is won", () => {
    renderPanel("converted", "won", "2026-09-24T10:00:00Z");
    expect(screen.getByText("Gagné")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Marquer/ })).not.toBeInTheDocument();
    expect(screen.getByText(/ne peut plus être modifiée/)).toBeInTheDocument();
  });

  it("warns that a mistaken 'won' cannot be fixed from the UI, and does nothing until confirmed", async () => {
    const user = userEvent.setup();
    setOutcomeMock.mockClear();
    renderPanel("handed_off");

    await user.click(screen.getByRole("button", { name: "Marquer gagné" }));

    expect(screen.getByText(/ne se corrige pas depuis l’interface/)).toBeInTheDocument();
    expect(setOutcomeMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.queryByRole("button", { name: "Confirmer" })).not.toBeInTheDocument();
  });

  it("says a 'lost' leaves the status unchanged and can still become won", async () => {
    const user = userEvent.setup();
    renderPanel("handed_off");
    await user.click(screen.getByRole("button", { name: "Marquer perdu" }));
    expect(screen.getByText(/statut du prospect ne change pas/)).toBeInTheDocument();
    expect(screen.getByText(/encore le marquer « gagné »/)).toBeInTheDocument();
  });

  it("sends the chosen outcome on confirmation", async () => {
    const user = userEvent.setup();
    setOutcomeMock.mockClear();
    setOutcomeMock.mockResolvedValueOnce({});
    renderPanel("handed_off");

    await user.click(screen.getByRole("button", { name: "Marquer perdu" }));
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    await waitFor(() => expect(setOutcomeMock).toHaveBeenCalledWith("lost", expect.anything()));
  });

  it("shows Beclose's own reason when the outcome is refused (409)", async () => {
    const user = userEvent.setup();
    setOutcomeMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "conflict",
        status: 409,
        details: {
          error: { code: "OUTCOME_NOT_ALLOWED", message: "Ce lead est déjà « gagné » (converted, état terminal)." },
        },
      }),
    );
    renderPanel("handed_off");

    await user.click(screen.getByRole("button", { name: "Marquer perdu" }));
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    expect(await screen.findByText(/déjà « gagné »/)).toBeInTheDocument();
  });
});
