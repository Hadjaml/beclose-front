import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createLeadPipelineApi } from "./lead-pipeline-api";

describe("createLeadPipelineApi", () => {
  it("getOverview() gets /organizations/{id}/overview and maps organizationId to workspaceId", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/overview");
      expect(options.method).toBe("GET");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return {
        data: {
          organizationId: "workspace-1",
          totalLeads: 3,
          leadCounts: {
            identified: 1,
            contacted: 1,
            replied: 0,
            qualified: 0,
            booked: 0,
            converted: 0,
            opted_out: 0,
            bounced: 0,
            disqualified: 0,
            handed_off: 1,
          },
          qualificationResultCounts: {
            qualified: 0,
            nurture: 1,
            not_qualified: 0,
            not_evaluated: 2,
          },
        },
      };
    });

    const overview = await createLeadPipelineApi(client).getOverview("workspace-1");

    expect(overview.workspaceId).toBe("workspace-1");
    expect(overview.totalLeads).toBe(3);
    expect(overview.leadCounts.handed_off).toBe(1);
    expect(overview.qualificationResultCounts.nurture).toBe(1);
  });
});
