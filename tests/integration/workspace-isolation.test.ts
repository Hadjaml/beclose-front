import { describe, expect, it } from "vitest";
import { workspaceKeys } from "@/shared/query/query-keys";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

describe("workspace isolation", () => {
  it("keeps scoped query keys distinct", () => {
    expect(workspaceKeys.list("workspace-a", "prospects")).not.toEqual(
      workspaceKeys.list("workspace-b", "prospects"),
    );
  });

  it("rejects an empty workspace identifier", () => {
    expect(workspaceIdSchema.safeParse(" ").success).toBe(false);
  });
});
