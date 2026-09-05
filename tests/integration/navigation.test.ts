import { describe, expect, it } from "vitest";
import { permissions, type AccessContext } from "@/features/access-control";
import {
  backofficeNavigation,
  portalNavigation,
  resolveNavigation,
  workspaceNavigation,
} from "@/features/navigation";

describe("navigation boundaries", () => {
  it("never exposes planned global destinations", () => {
    const paths = resolveNavigation(backofficeNavigation).map(({ href }) => href);
    expect(paths).toEqual([
      "/backoffice",
      "/backoffice/clients",
      "/backoffice/subscriptions",
      "/backoffice/team",
      "/backoffice/settings",
    ]);
  });

  it("keeps Portal navigation separate from Back Office", () => {
    const paths = resolveNavigation(portalNavigation, {
      workspaceId: "workspace-a",
    }).map(({ href }) => href);
    expect(paths).toHaveLength(8);
    expect(paths.every((path) => path.startsWith("/portal/workspace-a"))).toBe(true);
    expect(paths.some((path) => path.includes("configuration"))).toBe(false);
    expect(paths.some((path) => path.includes("learning"))).toBe(false);
  });

  it("filters workspace navigation with backend-provided permissions", () => {
    const accessContext: AccessContext = {
      actorUserId: "user-test",
      workspaceId: "workspace-a",
      effectivePermissions: [
        permissions.dashboardRead,
        permissions.conversationRead,
      ],
    };
    const ids = resolveNavigation(workspaceNavigation, {
      workspaceId: "workspace-a",
      accessContext,
    }).map(({ id }) => id);
    expect(ids).toEqual(["overview", "conversations"]);
  });
});
