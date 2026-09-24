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
        archivedAt: null,
        icpActive: null,
        bantActive: null,
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

  it("list() defaults archivedAt to null and only asks for archived ones when requested", async () => {
    let seenQuery: unknown;
    const client = fakeClient((_path, options) => {
      seenQuery = options.query;
      return {
        data: [
          {
            id: "org-1",
            name: "Acme",
            pitch: null,
            signature: null,
            telegramChatId: null,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
      };
    });

    const [first] = await createClientsApi(client).list();
    expect(first?.archivedAt).toBeNull();
    expect(seenQuery).toBeUndefined();

    await createClientsApi(client).list({ includeArchived: true });
    expect(seenQuery).toEqual({ includeArchived: true });
  });

  it("archive() posts /organizations/{id}/archive and returns the per-step disconnections", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/org-2/archive");
      expect(options.method).toBe("POST");
      return {
        data: {
          organization: {
            id: "org-2",
            name: "Acme",
            pitch: null,
            signature: null,
            telegramChatId: null,
            archivedAt: "2026-09-24T10:00:00Z",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-09-24T10:00:00Z",
          },
          disconnections: { gmail: "removed_locally_only", telegram: "left_group" },
        },
      };
    });

    const result = await createClientsApi(client).archive("org-2");

    expect(result.client.archivedAt).toBe("2026-09-24T10:00:00Z");
    expect(result.disconnections).toEqual({ gmail: "removed_locally_only", telegram: "left_group" });
  });

  it("list() carries icpActive/bantActive from Beclose, and treats absent flags as unknown (null), not false", async () => {
    const org = { id: "o", name: "A", pitch: null, signature: null, telegramChatId: null, createdAt: "x", updatedAt: "x" };
    const client = fakeClient(() => ({
      data: [{ ...org, icpActive: true, bantActive: false }, { ...org, id: "p" }],
    }));

    const [withFlags, legacy] = await createClientsApi(client).list();

    expect(withFlags).toMatchObject({ icpActive: true, bantActive: false });
    expect(legacy).toMatchObject({ icpActive: null, bantActive: null });
  });
});
