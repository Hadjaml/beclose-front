import { describe, expect, it } from "vitest";
import {
  hasAllPermissions,
  hasPermission,
  permissions,
  type AccessContext,
} from "@/features/access-control";

const context: AccessContext = {
  actorUserId: "user-test",
  workspaceId: "workspace-a",
  effectivePermissions: [permissions.prospectRead, permissions.approvalRead],
};

describe("access control", () => {
  it("uses effective permissions instead of role names", () => {
    expect(hasPermission(context, permissions.prospectRead)).toBe(true);
    expect(hasPermission(context, permissions.prospectReview)).toBe(false);
    expect(
      hasAllPermissions(context, [
        permissions.prospectRead,
        permissions.approvalRead,
      ]),
    ).toBe(true);
  });
});
