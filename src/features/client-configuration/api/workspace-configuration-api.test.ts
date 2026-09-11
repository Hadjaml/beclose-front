import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createWorkspaceConfigurationApi } from "./workspace-configuration-api";

describe("createWorkspaceConfigurationApi", () => {
  it("get() gets /organizations/{id}/configuration and maps organizationId to workspaceId", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/configuration");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          organizationId: "workspace-1",
          name: "Acme",
          pitch: "Pitch",
          signature: null,
          telegramChatId: null,
          qualificationCriteria: {
            version: 2,
            criteria: { budget: "high" },
            createdAt: "2026-01-01T00:00:00Z",
          },
        },
      };
    });

    const configuration = await createWorkspaceConfigurationApi(client).get("workspace-1");

    expect(configuration.workspaceId).toBe("workspace-1");
    expect(configuration.qualificationCriteria?.version).toBe(2);
    expect(configuration.qualificationCriteria?.criteria).toEqual({ budget: "high" });
  });

  it("get() accepts a null qualificationCriteria (no BANT grid defined yet)", async () => {
    const client = fakeClient(() => ({
      data: {
        organizationId: "workspace-1",
        name: "Acme",
        pitch: null,
        signature: null,
        telegramChatId: null,
        qualificationCriteria: null,
      },
    }));

    const configuration = await createWorkspaceConfigurationApi(client).get("workspace-1");

    expect(configuration.qualificationCriteria).toBeNull();
  });
});
