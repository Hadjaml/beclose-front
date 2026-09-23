import { describe, expect, it } from "vitest";
import { fakeClient, rejectingClient } from "../../../../tests/support/fake-api-client";
import { createSourcingRunsApi } from "./sourcing-runs-api";

describe("createSourcingRunsApi", () => {
  it("start() posts /organizations/{id}/sourcing-runs with an empty body", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/sourcing-runs");
      expect(options.method).toBe("POST");
      expect(options.body).toEqual({});
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return { data: { status: "started" } };
    });

    await expect(createSourcingRunsApi(client).start("workspace-1")).resolves.toBeUndefined();
  });

  it("propagates a rejection (e.g. 409 already-in-progress) instead of swallowing it", async () => {
    const client = rejectingClient(new Error("already running"));
    await expect(createSourcingRunsApi(client).start("workspace-1")).rejects.toThrow(
      "already running",
    );
  });
});
