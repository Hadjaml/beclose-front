import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceIntegrationStatusView } from "./workspace-integration-status-view";

const view = (google: Record<string, unknown>) =>
  render(
    <WorkspaceIntegrationStatusView
      status={{
        workspaceId: "ws-1",
        google: {
          connected: true,
          expiresAt: "2026-09-24T10:00:00Z",
          scopes: ["gmail.send"],
          status: null,
          lastSuccessAt: null,
          lastFailureAt: null,
          lastFailureReason: null,
          ...google,
        } as never,
      }}
    />,
  );

describe("WorkspaceIntegrationStatusView — Gmail health (not the access-token expiry)", () => {
  it("an expired access token with a healthy status is NOT a reconnection request", () => {
    view({ status: "healthy", expiresAt: "2020-01-01T00:00:00Z" });

    expect(screen.getByText("Connecté")).toBeInTheDocument();
    expect(screen.queryByText("Reconnexion nécessaire")).not.toBeInTheDocument();
  });

  it("presents the access-token expiry as information with a readable date", () => {
    view({ status: "healthy", expiresAt: "2026-09-24T10:00:00Z" });

    expect(screen.getByText(/Jeton d’accès valable jusqu’au 24 sept\. 2026/)).toBeInTheDocument();
    expect(screen.queryByText(/2026-09-24T/)).not.toBeInTheDocument();
  });

  it("unknown is 'not yet verified', not connected", () => {
    view({ status: "unknown" });
    expect(screen.getByText("Non encore vérifié")).toBeInTheDocument();
    expect(screen.queryByText("Connecté")).not.toBeInTheDocument();
  });

  it("reconnect_required shows the failure reason and when it happened", () => {
    view({
      status: "reconnect_required",
      connected: false,
      lastFailureAt: "2026-09-24T08:00:00Z",
      lastFailureReason: "refresh_refused",
    });

    expect(screen.getByText("Reconnexion nécessaire")).toBeInTheDocument();
    expect(screen.getByText(/renouvellement de l’accès refusé/)).toBeInTheDocument();
    expect(screen.getByText(/Dernier échec : 24 sept\. 2026/)).toBeInTheDocument();
  });

  it("shows the last success date when known", () => {
    view({ status: "stale", lastSuccessAt: "2026-09-20T08:00:00Z" });
    expect(screen.getByText("Dernière vérification ancienne")).toBeInTheDocument();
    expect(screen.getByText(/Dernier succès : 20 sept\. 2026/)).toBeInTheDocument();
  });
});
