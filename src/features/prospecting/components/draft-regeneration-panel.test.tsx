import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import { DraftRegenerationPanel } from "./draft-regeneration-panel";

const requestMock = vi.hoisted(() => vi.fn());
vi.mock("../api/use-request-draft-regeneration-mutation", () => ({
  useRequestDraftRegenerationMutation: () => useMutation({ mutationFn: requestMock }),
}));

const state = (over: Record<string, unknown> = {}) => ({
  available: true,
  requested: false,
  rejectedDrafts: 1,
  remaining: 2,
  ...over,
});

function renderPanel(draftRegeneration: ReturnType<typeof state> | null) {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <DraftRegenerationPanel workspaceId="ws-1" leadId="lead-1" draftRegeneration={draftRegeneration} />
    </QueryClientProvider>,
  );
}

beforeEach(() => requestMock.mockReset());

describe("DraftRegenerationPanel (a rejected draft has a way forward — audit C07)", () => {
  it("renders nothing without Beclose's state (older backend) or when there is nothing to regenerate", () => {
    renderPanel(null);
    expect(screen.queryByRole("button", { name: "Nouveau brouillon" })).not.toBeInTheDocument();

    renderPanel(state({ available: false, rejectedDrafts: 0, remaining: 3 }));
    expect(screen.queryByRole("button", { name: "Nouveau brouillon" })).not.toBeInTheDocument();
  });

  it("offers 'Nouveau brouillon' only when Beclose says it is available, and asks to confirm first", async () => {
    const user = userEvent.setup();
    requestMock.mockResolvedValue({ leadId: "lead-1", status: "requested", remainingRegenerations: 1 });
    renderPanel(state());

    await user.click(screen.getByRole("button", { name: "Nouveau brouillon" }));
    expect(requestMock).not.toHaveBeenCalled();
    expect(screen.getByText(/il reste 2 reprises/)).toBeInTheDocument();
    expect(screen.getByText(/rejeté est conservé/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirmer" }));
    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));
  });

  it("shows 'demande enregistrée' when a regeneration is already requested, with no button", () => {
    renderPanel(state({ available: false, requested: true }));

    expect(screen.getByText(/Demande enregistrée/)).toBeInTheDocument();
    expect(screen.getByText(/moins d’une minute/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nouveau brouillon" })).not.toBeInTheDocument();
  });

  it("says the limit is reached once no regeneration is left", () => {
    renderPanel(state({ available: false, remaining: 0, rejectedDrafts: 3 }));

    expect(screen.getByText(/Limite de reprises atteinte/)).toBeInTheDocument();
  });

  it("shows Beclose's own reason on a 409 refusal", async () => {
    const user = userEvent.setup();
    requestMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "conflict",
        status: 409,
        details: { error: { code: "DRAFT_REGENERATION_NOT_ALLOWED", message: "Un brouillon est déjà en attente." } },
      }),
    );
    renderPanel(state());

    await user.click(screen.getByRole("button", { name: "Nouveau brouillon" }));
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Un brouillon est déjà en attente.");
  });

  it("names the limit on DRAFT_REGENERATION_LIMIT_REACHED", async () => {
    const user = userEvent.setup();
    requestMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "conflict",
        status: 409,
        details: { error: { code: "DRAFT_REGENERATION_LIMIT_REACHED", message: "" } },
      }),
    );
    renderPanel(state());

    await user.click(screen.getByRole("button", { name: "Nouveau brouillon" }));
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/limite/i);
  });
});
