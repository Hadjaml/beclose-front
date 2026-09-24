import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createMessageLogApi } from "./message-log-api";

const messageWire = {
  id: "msg-1",
  leadId: "lead-1",
  channel: "email",
  direction: "outbound",
  status: "pending_approval",
  supersedesId: null,
  content: "Objet: Bonjour\n\nCorps",
  sentAt: null,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("createMessageLogApi", () => {
  it("list() gets /organizations/{id}/messages with an optional leadId filter", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/messages");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      expect(options.query).toEqual({ leadId: "lead-1", limit: 20, offset: 0 });
      return { data: [messageWire], pagination: { limit: 20, offset: 0, total: 1 } };
    });

    const page = await createMessageLogApi(client).list("workspace-1", {
      leadId: "lead-1",
      limit: 20,
      offset: 0,
    });

    expect(page.data[0]?.id).toBe("msg-1");
    expect(page.data[0]?.status).toBe("pending_approval");
  });

  it("list() accepts a null status (inbound messages have no approval cycle)", async () => {
    const client = fakeClient(() => ({
      data: [{ ...messageWire, direction: "inbound", status: null }],
      pagination: { limit: 50, offset: 0, total: 1 },
    }));

    const page = await createMessageLogApi(client).list("workspace-1");

    expect(page.data[0]?.direction).toBe("inbound");
    expect(page.data[0]?.status).toBeNull();
  });

  it("list() accepts the system-cancelled status (a follow-up cancelled on opt-out/disqualification)", async () => {
    const client = fakeClient(() => ({
      data: [{ ...messageWire, status: "cancelled" }],
      pagination: { limit: 50, offset: 0, total: 1 },
    }));

    const page = await createMessageLogApi(client).list("workspace-1");

    expect(page.data[0]?.status).toBe("cancelled");
  });
});
