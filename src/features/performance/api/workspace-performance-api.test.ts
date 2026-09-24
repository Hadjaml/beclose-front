import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createWorkspacePerformanceApi } from "./workspace-performance-api";

export const precisionWire = {
  transmitted: 40,
  booked: 10,
  handedOffStrongNeed: 22,
  handedOffTechnical: 8,
  converted: 2,
  automatic: { qualifiedByGrid: 30, qualifiedShare: 0.75 },
  manual: { won: 2, lost: 1, unknown: 37, outcomeCoverage: 0.075, winRateAmongKnown: 0.6667 },
};

describe("createWorkspacePerformanceApi", () => {
  it("getPrecision() gets /organizations/{id}/precision and parses the named components", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/workspace-1/precision");
      expect(options.context).toEqual({ workspaceId: "workspace-1" });
      return { data: precisionWire };
    });

    const precision = await createWorkspacePerformanceApi(client).getPrecision("workspace-1");

    expect(precision.manual.outcomeCoverage).toBe(0.075);
    expect(precision.automatic.qualifiedByGrid).toBe(30);
  });

  it("accepts null ratios (no lead transmitted / no outcome declared yet)", async () => {
    const client = fakeClient(() => ({
      data: {
        ...precisionWire,
        transmitted: 0,
        automatic: { qualifiedByGrid: 0, qualifiedShare: null },
        manual: { won: 0, lost: 0, unknown: 0, outcomeCoverage: null, winRateAmongKnown: null },
      },
    }));

    const precision = await createWorkspacePerformanceApi(client).getPrecision("workspace-1");

    expect(precision.automatic.qualifiedShare).toBeNull();
    expect(precision.manual.winRateAmongKnown).toBeNull();
  });

  it("getApprovalMetrics() gets /organizations/{id}/approval-metrics", async () => {
    const client = fakeClient((path) => {
      expect(path).toBe("/organizations/workspace-1/approval-metrics");
      return {
        data: {
          decided: 30,
          acceptedAsIs: 25,
          corrected: 4,
          rejected: 1,
          pending: 2,
          correctionRate: 0.1667,
          criterion: {
            windowSize: 20,
            maxCorrectionRate: 0.1,
            windowsRequired: 2,
            windowRates: [0.2],
            sufficientData: false,
            met: false,
          },
        },
      };
    });

    const metrics = await createWorkspacePerformanceApi(client).getApprovalMetrics("workspace-1");

    expect(metrics.decided).toBe(30);
    expect(metrics.criterion.sufficientData).toBe(false);
  });
});
