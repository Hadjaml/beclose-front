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

  it("create() posts /organizations and maps the response to a ClientSummary", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations");
      expect(options.method).toBe("POST");
      expect(options.body).toEqual({
        name: "Acme",
        pitch: null,
        signature: null,
        telegramChatId: null,
      });
      return {
        data: {
          id: "org-2",
          name: "Acme",
          pitch: null,
          signature: null,
          telegramChatId: null,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      };
    });

    const created = await createClientsApi(client).create({
      name: "Acme",
      pitch: null,
      signature: null,
      telegramChatId: null,
    });

    expect(created.workspaceId).toBe("org-2");
  });

  it("update() sends only the given field, omitting the rest (PATCH semantics)", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/org-2");
      expect(options.method).toBe("PATCH");
      expect(options.context).toEqual({ workspaceId: "org-2" });
      expect(options.body).toEqual({ telegramChatId: "-100123456" });
      return {
        data: {
          id: "org-2",
          name: "Acme",
          pitch: null,
          signature: null,
          telegramChatId: "-100123456",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      };
    });

    const updated = await createClientsApi(client).update("org-2", { telegramChatId: "-100123456" });

    expect(updated.telegramChatId).toBe("-100123456");
  });
});
