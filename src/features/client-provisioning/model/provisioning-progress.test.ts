import { describe, expect, it } from "vitest";
import { deriveProvisioningProgress } from "./provisioning-progress";

describe("deriveProvisioningProgress (what the API already holds decides the step)", () => {
  it("starts at the ICP profile when the organization exists but nothing else does", () => {
    expect(deriveProvisioningProgress({ hasIcpProfile: false, hasBantCriteria: false })).toEqual({
      currentStep: "icp",
      statuses: { organization: "COMPLETED", icp: "IN_PROGRESS", bant: "NOT_STARTED", connections: "NOT_STARTED" },
    });
  });

  it("goes to the BANT grid once the ICP profile exists", () => {
    expect(deriveProvisioningProgress({ hasIcpProfile: true, hasBantCriteria: false })).toEqual({
      currentStep: "bant",
      statuses: { organization: "COMPLETED", icp: "COMPLETED", bant: "IN_PROGRESS", connections: "NOT_STARTED" },
    });
  });

  it("still asks for the ICP profile when only the BANT grid exists", () => {
    const progress = deriveProvisioningProgress({ hasIcpProfile: false, hasBantCriteria: true });
    expect(progress.currentStep).toBe("icp");
    expect(progress.statuses.bant).toBe("COMPLETED");
  });

  it("lands on the connections step once both policies exist", () => {
    expect(deriveProvisioningProgress({ hasIcpProfile: true, hasBantCriteria: true })).toEqual({
      currentStep: "connections",
      statuses: { organization: "COMPLETED", icp: "COMPLETED", bant: "COMPLETED", connections: "IN_PROGRESS" },
    });
  });
});
