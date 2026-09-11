import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadProspectsApi } from "./lead-prospects-api";

const prospectWire = {
  leadId: "lead-1",
  status: "identified",
  score: null,
  sourceLayer: "sourcing",
  identifiedAt: "2026-01-01T00:00:00Z",
  contactedAt: null,
  repliedAt: null,
  qualifiedAt: null,
  bookedAt: null,
  convertedAt: null,
  optedOutAt: null,
  bouncedAt: null,
  disqualifiedAt: null,
  handedOffAt: null,
  company: {
    id: "company-1",
    name: "Acme",
    siren: null,
    sector: null,
    headcount: null,
    source: "gouv",
  },
  contact: {
    id: "contact-1",
    fullName: null,
    email: "a@b.com",
    role: null,
    linkedinUrl: null,
    source: null,
  },
};

describe("createLeadProspectsApi", () => {
  it("list() gets /organizations/{id}/prospects with a status filter and pagination", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/prospects");
      expect(options.method).toBe("GET");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      expect(options.query).toEqual({ status: "identified", limit: 10, offset: 0 });
      return { data: [prospectWire], pagination: { limit: 10, offset: 0, total: 1 } };
    });

    const page = await createLeadProspectsApi(client).list("workspace-1", {
      status: "identified",
      limit: 10,
      offset: 0,
    });

    expect(page.data).toHaveLength(1);
    expect(page.data[0]?.leadId).toBe("lead-1");
    expect(page.data[0]?.company.name).toBe("Acme");
    expect(page.pagination).toEqual({ limit: 10, offset: 0, total: 1 });
  });

  it("list() works without an explicit query (no filter)", async () => {
    const client = fakeClient((_path, options) => {
      expect(options.query).toEqual({ status: undefined, limit: undefined, offset: undefined });
      return { data: [], pagination: { limit: 50, offset: 0, total: 0 } };
    });

    const page = await createLeadProspectsApi(client).list("workspace-1");

    expect(page.data).toEqual([]);
  });
});
