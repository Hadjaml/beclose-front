import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadProspectsApi } from "./lead-prospects-api";

describe("createLeadProspectsApi.requestDraftRegeneration", () => {
  it("POSTs /prospects/{leadId}/draft-regeneration and returns what Beclose says is left", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/ws-1/prospects/lead-1/draft-regeneration");
      expect(options.method).toBe("POST");
      expect(options.context).toEqual({ workspaceId: "ws-1" });
      return { data: { leadId: "lead-1", status: "requested", remainingRegenerations: 2 } };
    });

    const result = await createLeadProspectsApi(client).requestDraftRegeneration("ws-1", "lead-1");

    expect(result).toEqual({ leadId: "lead-1", status: "requested", remainingRegenerations: 2 });
  });
});
