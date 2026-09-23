import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GmailConnectionStep } from "./gmail-connection-step";

const queryMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/integrations", async () => {
  const actual = await vi.importActual<typeof import("@/features/integrations")>(
    "@/features/integrations",
  );
  return { ...actual, useWorkspaceIntegrationStatusQuery: queryMock };
});

function renderStep(onFinish = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return { onFinish, ...render(
    <QueryClientProvider client={queryClient}>
      <GmailConnectionStep workspaceId="workspace-1" onFinish={onFinish} />
    </QueryClientProvider>,
  ) };
}

describe("GmailConnectionStep", () => {
  it("shows a success message when Gmail is connected", () => {
    queryMock.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: { workspaceId: "workspace-1", google: { connected: true, expiresAt: null, scopes: [] } },
    });

    renderStep();

    expect(screen.getByText("Gmail connecté")).toBeInTheDocument();
    expect(screen.queryByText(/connect_gmail_cli/)).not.toBeInTheDocument();
  });

  it("shows the exact CLI command with the real workspace id when not connected", () => {
    queryMock.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: { workspaceId: "workspace-1", google: null },
    });

    renderStep();

    expect(
      screen.getByText("uv run python -m workers.connect_gmail_cli workspace-1"),
    ).toBeInTheDocument();
  });

  it("calls onFinish when clicking Terminer, regardless of connection status", async () => {
    const user = userEvent.setup();
    queryMock.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: { workspaceId: "workspace-1", google: null },
    });
    const { onFinish } = renderStep();

    await user.click(screen.getByRole("button", { name: "Terminer" }));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("shows a retry option when the status check fails", () => {
    const refetch = vi.fn();
    queryMock.mockReturnValue({ isPending: false, isError: true, isSuccess: false, refetch });

    renderStep();

    expect(screen.getByText("Impossible de vérifier la connexion Gmail")).toBeInTheDocument();
  });
});
