import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ClientWorkspaceHeader } from "./client-workspace-header";

const configurationQueryMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/client-configuration", () => ({
  useWorkspaceConfigurationQuery: configurationQueryMock,
}));

describe("ClientWorkspaceHeader (audit C11)", () => {
  beforeEach(() => configurationQueryMock.mockReset());

  it("shows the client's name as the title, not the UUID", () => {
    configurationQueryMock.mockReturnValue({ isSuccess: true, data: { name: "Acme" } });
    render(<ClientWorkspaceHeader workspaceId="0b7e-uuid" switcherHref="/backoffice/clients" />);

    expect(screen.getByRole("heading", { level: 1, name: "Acme" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Changer de workspace" })).toBeInTheDocument();
  });

  it("keeps the identifier as title while loading or when the name cannot be read", () => {
    configurationQueryMock.mockReturnValue({ isSuccess: false, data: undefined });
    render(<ClientWorkspaceHeader workspaceId="0b7e-uuid" />);

    expect(screen.getByRole("heading", { level: 1, name: "0b7e-uuid" })).toBeInTheDocument();
  });
});
