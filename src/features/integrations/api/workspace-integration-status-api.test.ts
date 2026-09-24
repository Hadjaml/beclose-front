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
    });
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
