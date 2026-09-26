import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createWorkspaceIntegrationStatusApi } from "./workspace-integration-status-api";

describe("createWorkspaceIntegrationStatusApi", () => {
  it("get() gets /organizations/{id}/integrations and attaches the workspaceId", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/integrations");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          google: { connected: true, expiresAt: "2026-01-01T00:00:00Z", scopes: ["gmail.send"] },
        },
      };
    });

    const status = await createWorkspaceIntegrationStatusApi(client).get("workspace-1");

    expect(status).toEqual({
      workspaceId: "workspace-1",
      google: {
        connected: true,
        expiresAt: "2026-01-01T00:00:00Z",
        scopes: ["gmail.send"],
        status: null,
        lastSuccessAt: null,
        lastFailureAt: null,
        lastFailureReason: null,
      },
      notion: null,
    });
  });

  it("get() carries the Notion block when Beclose sends it, and null when it does not", async () => {
    const withNotion = fakeClient(() => ({
      data: {
        google: null,
        notion: { connected: false, status: "reconnect_required", lastSuccessAt: null, lastFailureAt: "2026-09-25T08:00:00Z", lastFailureReason: "unauthorized", pendingSyncs: 3, exhaustedSyncs: 1 },
      },
    }));
    const { notion } = await createWorkspaceIntegrationStatusApi(withNotion).get("workspace-1");
    expect(notion).toMatchObject({ status: "reconnect_required", lastFailureReason: "unauthorized", pendingSyncs: 3, exhaustedSyncs: 1 });

    const without = await createWorkspaceIntegrationStatusApi(fakeClient(() => ({ data: { google: null } }))).get("workspace-1");
    expect(without.notion).toBeNull();
  });

  it("get() carries the health fields Beclose added (status, last success/failure, reason)", async () => {
    const client = fakeClient(() => ({
      data: {
        google: {
          connected: false,
          expiresAt: null,
          scopes: [],
          status: "reconnect_required",
          lastSuccessAt: "2026-09-23T08:00:00Z",
          lastFailureAt: "2026-09-24T08:00:00Z",
          lastFailureReason: "refresh_refused",
        },
      },
    }));

    const { google } = await createWorkspaceIntegrationStatusApi(client).get("workspace-1");

    expect(google).toMatchObject({ status: "reconnect_required", lastFailureReason: "refresh_refused" });
  });

  it("get() accepts a null google integration (never connected)", async () => {
    const client = fakeClient(() => ({ data: { google: null } }));

    const status = await createWorkspaceIntegrationStatusApi(client).get("workspace-1");

    expect(status.google).toBeNull();
  });
});
