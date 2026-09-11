import { describe, expect, it } from "vitest";
import { fakeClient, rejectingClient } from "../../../../tests/support/fake-api-client";
import { createClientsApi } from "./clients-api";

describe("createClientsApi", () => {
  it("list() gets /organizations and maps id to workspaceId", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations");
      expect(options.method).toBe("GET");
      return {
        data: [
          {
            id: "org-1",
            name: "Acme",
            pitch: "Pitch",
            signature: "Sig",
            telegramChatId: null,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
      };
    });

    const clients = await createClientsApi(client).list();

    expect(clients).toEqual([
      {
        workspaceId: "org-1",
        name: "Acme",
        pitch: "Pitch",
        signature: "Sig",
        telegramChatId: null,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ]);
  });

  it("list() propagates a network/server error instead of swallowing it", async () => {
    const client = rejectingClient(new Error("network down"));
    await expect(createClientsApi(client).list()).rejects.toThrow("network down");
  });
});
