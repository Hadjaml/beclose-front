import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import type { ArchiveResult } from "../api/clients-api";
import type { ClientSummary } from "../schemas/client-summary-schema";
import { ClientRow } from "./client-row";

const archiveMock = vi.hoisted(() => vi.fn());

vi.mock("../api/use-archive-client-mutation", () => ({
  useArchiveClientMutation: () => useMutation({ mutationFn: archiveMock }),
}));

const activeClient: ClientSummary = {
  workspaceId: "org-1",
  name: "Acme",
  pitch: null,
  signature: null,
  telegramChatId: null,
  archivedAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

function renderRow(client = activeClient, onArchived: ((result: ArchiveResult) => void) | null = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ul>
        <ClientRow client={client} {...(onArchived === null ? {} : { onArchived })} />
      </ul>
    </QueryClientProvider>,
  );
}

describe("ClientRow", () => {
  it("offers no archive action without a callback from the composition layer", () => {
    renderRow(activeClient, null);
    expect(screen.queryByRole("button", { name: "Archiver" })).not.toBeInTheDocument();
  });

  it("offers no archive action on an already-archived client, and badges it", () => {
    renderRow({ ...activeClient, archivedAt: "2026-09-24T10:00:00Z" });
    expect(screen.queryByRole("button", { name: "Archiver" })).not.toBeInTheDocument();
    expect(screen.getByText("Archivé")).toBeInTheDocument();
  });

  it("explains what will be disconnected before archiving, and does nothing until confirmed", async () => {
    const user = userEvent.setup();
    archiveMock.mockClear();
    renderRow();

    await user.click(screen.getByRole("button", { name: "Archiver" }));

    expect(screen.getByText(/révoqué chez Google/)).toBeInTheDocument();
    expect(screen.getByText(/le bot quittera le groupe/)).toBeInTheDocument();
    expect(archiveMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.queryByRole("button", { name: "Confirmer l’archivage" })).not.toBeInTheDocument();
  });

  it("archives on confirmation and hands the result to the composition layer", async () => {
    const user = userEvent.setup();
    const onArchived = vi.fn();
    const result = {
      client: { ...activeClient, archivedAt: "2026-09-24T10:00:00Z" },
      disconnections: { gmail: "revoked", telegram: "none" },
    };
    archiveMock.mockResolvedValueOnce(result);
    renderRow(activeClient, onArchived);

    await user.click(screen.getByRole("button", { name: "Archiver" }));
    await user.click(screen.getByRole("button", { name: "Confirmer l’archivage" }));

    await waitFor(() => expect(onArchived).toHaveBeenCalledWith(result));
    expect(archiveMock).toHaveBeenCalledWith("org-1", expect.anything());
  });

  it("explains a 409 because a sourcing run is in progress", async () => {
    const user = userEvent.setup();
    archiveMock.mockRejectedValueOnce(
      new ApiError({
        kind: "http",
        message: "conflict",
        status: 409,
        details: { error: { code: "SOURCING_RUN_IN_PROGRESS", message: "…" } },
      }),
    );
    renderRow();

    await user.click(screen.getByRole("button", { name: "Archiver" }));
    await user.click(screen.getByRole("button", { name: "Confirmer l’archivage" }));

    expect(await screen.findByText(/Un sourcing est en cours/)).toBeInTheDocument();
  });
});
