import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bantCriteriaWire, icpCriteriaWire } from "../../../../tests/support/criteria-wire-fixtures";
import { bantCriteriaWireSchema } from "../schemas/bant-criteria-wire-schema";
import { icpCriteriaWireSchema } from "../schemas/icp-criteria-wire-schema";
import { WorkspaceConfigurationView } from "./workspace-configuration-view";

const base = {
  workspaceId: "org-1",
  name: "Acme",
  pitch: null,
  signature: null,
  telegramChatId: null,
  sourcingReadiness: null,
};

describe("WorkspaceConfigurationView — correcting a policy", () => {
  it("offers a prefilled NEW version for the active ICP profile and the active BANT grid", () => {
    render(
      <WorkspaceConfigurationView
        configuration={{
          ...base,
          icpProfile: { name: "ICP", version: 1, createdAt: "x", criteria: icpCriteriaWireSchema.parse(icpCriteriaWire) },
          qualificationCriteria: { version: 1, createdAt: "x", criteria: bantCriteriaWireSchema.parse(bantCriteriaWire) },
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Corriger : nouvelle version du profil ICP" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1&step=icp",
    );
    expect(screen.getByRole("link", { name: "Corriger : nouvelle version de la grille BANT" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1&step=bant",
    );
  });

  it("offers no correction link for a policy that does not exist yet (resuming creates it)", () => {
    render(
      <WorkspaceConfigurationView
        configuration={{ ...base, icpProfile: null, qualificationCriteria: null }}
      />,
    );

    expect(screen.queryByRole("link", { name: /Corriger/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reprendre la configuration" })).toBeInTheDocument();
  });
});
