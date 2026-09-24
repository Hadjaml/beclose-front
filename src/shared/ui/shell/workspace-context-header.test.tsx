import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceContextHeader } from "./workspace-context-header";

describe("WorkspaceContextHeader", () => {
  it("links 'Changer de workspace' to the given destination — a real link, not a disabled button", () => {
    render(<WorkspaceContextHeader workspaceId="ws-1" switcherHref="/backoffice/clients" />);
    const link = screen.getByRole("link", { name: "Changer de workspace" });
    expect(link).toHaveAttribute("href", "/backoffice/clients");
    expect(screen.queryByRole("button", { name: "Changer de workspace" })).not.toBeInTheDocument();
  });

  it("renders no switcher at all without a destination (e.g. the client portal)", () => {
    render(<WorkspaceContextHeader workspaceId="ws-1" />);
    expect(screen.queryByText("Changer de workspace")).not.toBeInTheDocument();
  });
});
