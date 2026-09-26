import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceIntegrationStatusView } from "./workspace-integration-status-view";

const view = (google: Record<string, unknown>) =>
  render(
    <WorkspaceIntegrationStatusView
      status={{
        workspaceId: "ws-1",
        notion: null,
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

const notionView = (notion: Record<string, unknown> | null, google: unknown = null) =>
  render(
    <WorkspaceIntegrationStatusView
      status={{
        workspaceId: "ws-1",
        google: google as never,
        notion: notion === null ? null : ({
          connected: true,
          status: "healthy",
          lastSuccessAt: null,
          lastFailureAt: null,
          lastFailureReason: null,
          pendingSyncs: 0,
          exhaustedSyncs: 0,
          ...notion,
        } as never),
      }}
    />,
  );

describe("WorkspaceIntegrationStatusView — Notion", () => {
  it("shows the status, the failure reason in French, and both counters", () => {
    notionView({
      status: "degraded",
      lastFailureAt: "2026-09-25T08:00:00Z",
      lastFailureReason: "rate_limited",
      lastSuccessAt: "2026-09-24T08:00:00Z",
      pendingSyncs: 4,
      exhaustedSyncs: 2,
    });

    expect(screen.getByText("Notion")).toBeInTheDocument();
    expect(screen.getByText("Incident transitoire")).toBeInTheDocument();
    expect(screen.getByText(/limite de débit de Notion atteinte/)).toBeInTheDocument();
    expect(screen.getByText(/Dernier échec : 25 sept\. 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Dernier succès : 24 sept\. 2026/)).toBeInTheDocument();
    expect(screen.getByText("En attente de copie")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Échecs définitifs")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("unknown reads 'not yet verified', not connected", () => {
    notionView({ status: "unknown" });
    expect(screen.getByText("Non encore vérifié")).toBeInTheDocument();
    expect(screen.queryByText("Connecté")).not.toBeInTheDocument();
  });

  it("a Notion-less client shows 'Notion non connecté' next to Gmail, not an empty page", () => {
    notionView(null, {
      connected: true, expiresAt: null, scopes: [], status: "healthy", lastSuccessAt: null, lastFailureAt: null, lastFailureReason: null,
    });
    expect(screen.getByText("Notion non connecté")).toBeInTheDocument();
    expect(screen.getByText("Connecté")).toBeInTheDocument();
  });

  it("nothing connected at all keeps the single empty state", () => {
    notionView(null, null);
    expect(screen.getByText("Aucune intégration connectée")).toBeInTheDocument();
  });

  it("exhausted syncs are called out as final failures, not pending", () => {
    notionView({ status: "healthy", exhaustedSyncs: 3, pendingSyncs: 0 });
    expect(screen.getByText(/reprises épuisées/)).toBeInTheDocument();
  });
});
