import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConnectionsStep } from "./connections-step";

const integrationStatusQueryMock = vi.hoisted(() => vi.fn());
const updateClientMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/integrations", async () => {
  const actual = await vi.importActual<typeof import("@/features/integrations")>(
    "@/features/integrations",
  );
  return { ...actual, useWorkspaceIntegrationStatusQuery: integrationStatusQueryMock };
});

vi.mock("@/features/clients", async () => {
  const actual = await vi.importActual<typeof import("@/features/clients")>("@/features/clients");
  return {
    ...actual,
    useUpdateClientMutation: () => useMutation({ mutationFn: updateClientMock }),
  };
});

function renderStep(telegramChatId: string | null, onFinish = vi.fn(), onTelegramChatIdChange = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    onFinish,
    onTelegramChatIdChange,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ConnectionsStep
          workspaceId="workspace-1"
          telegramChatId={telegramChatId}
          onTelegramChatIdChange={onTelegramChatIdChange}
          onFinish={onFinish}
        />
      </QueryClientProvider>,
    ),
  };
}

const gmailNotConnected = { isPending: false, isError: false, isSuccess: true, data: { workspaceId: "workspace-1", google: null } };

describe("ConnectionsStep", () => {
  it("shows a success message when Gmail is connected", () => {
    integrationStatusQueryMock.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: { workspaceId: "workspace-1", google: { connected: true, expiresAt: null, scopes: [] } },
    });

    renderStep(null);

    expect(screen.getByText("Gmail connecté")).toBeInTheDocument();
    expect(screen.queryByText(/connect_gmail_cli/)).not.toBeInTheDocument();
  });

  it("shows the exact CLI command with the real workspace id when Gmail is not connected", () => {
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);

    renderStep(null);

    expect(
      screen.getByText("uv run python -m workers.connect_gmail_cli workspace-1"),
    ).toBeInTheDocument();
  });

  it("shows the real chat id when the Telegram group is already filled in", () => {
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);

    renderStep("-100123456");

    expect(screen.getByText("Groupe Telegram renseigné")).toBeInTheDocument();
    expect(screen.getByText("-100123456")).toBeInTheDocument();
  });

  it("shows the reminder procedure when the Telegram group is not filled in", () => {
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);

    renderStep(null);

    expect(screen.getByText("Groupe Telegram non renseigné")).toBeInTheDocument();
  });

  it("calls onFinish when clicking Terminer, regardless of connection status", async () => {
    const user = userEvent.setup();
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);
    const { onFinish } = renderStep(null);

    await user.click(screen.getByRole("button", { name: "Terminer" }));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("shows a retry option when the Gmail status check fails", () => {
    const refetch = vi.fn();
    integrationStatusQueryMock.mockReturnValue({ isPending: false, isError: true, isSuccess: false, refetch });

    renderStep(null);

    expect(screen.getByText("Impossible de vérifier la connexion Gmail")).toBeInTheDocument();
  });

  it("lets a blank Telegram chat id be filled in via PATCH, and reports it back to the wizard", async () => {
    const user = userEvent.setup();
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);
    updateClientMock.mockResolvedValueOnce({
      workspaceId: "workspace-1",
      name: "Acme",
      pitch: null,
      signature: null,
      telegramChatId: "-100123456",
      createdAt: "2026-09-23T00:00:00Z",
      updatedAt: "2026-09-23T00:00:00Z",
    });
    const { onTelegramChatIdChange, onFinish } = renderStep(null);

    await user.click(screen.getByRole("button", { name: "Renseigner l’identifiant" }));
    await user.type(screen.getByLabelText("Identifiant du groupe Telegram"), "-100123456");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(updateClientMock).toHaveBeenCalledWith({ telegramChatId: "-100123456" }, expect.anything()));
    await waitFor(() => expect(onTelegramChatIdChange).toHaveBeenCalledWith("-100123456"));
    // Editing must never trigger the step's own "Terminer" submit.
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("lets an already-filled Telegram chat id be corrected", async () => {
    const user = userEvent.setup();
    integrationStatusQueryMock.mockReturnValue(gmailNotConnected);
    updateClientMock.mockResolvedValueOnce({
      workspaceId: "workspace-1",
      name: "Acme",
      pitch: null,
      signature: null,
      telegramChatId: "-100999999",
      createdAt: "2026-09-23T00:00:00Z",
      updatedAt: "2026-09-23T00:00:00Z",
    });
    const { onTelegramChatIdChange } = renderStep("-100123456");

    await user.click(screen.getByRole("button", { name: "Corriger" }));
    const input = screen.getByLabelText("Identifiant du groupe Telegram");
    await user.clear(input);
    await user.type(input, "-100999999");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(updateClientMock).toHaveBeenCalledWith({ telegramChatId: "-100999999" }, expect.anything()));
    await waitFor(() => expect(onTelegramChatIdChange).toHaveBeenCalledWith("-100999999"));
  });
});
