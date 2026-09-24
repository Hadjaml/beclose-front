import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientSetupStatus } from "./client-setup-status";

function renderStatus(icpActive: boolean | null, bantActive: boolean | null) {
  render(<ClientSetupStatus workspaceId="org-1" icpActive={icpActive} bantActive={bantActive} />);
}

describe("ClientSetupStatus (audit A06: an unfinished client is never shown as configured)", () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
  ])("flags an incomplete configuration (icpActive=%s, bantActive=%s) and links to resume the same organization", (icp, bant) => {
    renderStatus(icp, bant);

    expect(screen.getByText("Configuration incomplète")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reprendre" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1",
    );
  });

  it("shows nothing when both are active", () => {
    renderStatus(true, true);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("an unknown flag (null) is not 'missing': nothing is shown, whichever is unknown", () => {
    renderStatus(null, null);
    renderStatus(true, null);
    renderStatus(null, false);

    expect(screen.queryByText("Configuration incomplète")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
