import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConfigurationStatusBanner } from "./configuration-status-banner";

const labelled = { criteria: { prioritySectors: [{ tier: 1, sectors: [{ id: "s", labelFr: "Conseil" }] }] } };
const noSector = { criteria: { prioritySectors: [] } };

describe("ConfigurationStatusBanner", () => {
  it("says the configuration is incomplete and offers to resume the same organization", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{ icpProfile: null, qualificationCriteria: null }}
      />,
    );

    expect(screen.getByText("Configuration incomplète")).toBeInTheDocument();
    expect(screen.getByText(/le profil ICP, la grille BANT/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reprendre la configuration" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1",
    );
    expect(screen.queryByText(/prêt/i)).not.toBeInTheDocument();
  });

  it("does not announce the setup as fine when the active ICP cannot source (audit A08)", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{ icpProfile: noSector, qualificationCriteria: {} }}
      />,
    );

    expect(screen.getByText("Sourcing impossible")).toBeInTheDocument();
    expect(screen.getByText(/aucun secteur prioritaire de rang 1/)).toBeInTheDocument();
    expect(screen.queryByText("Profils en place")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nouvelle version du profil ICP" })).toHaveAttribute(
      "href",
      "/backoffice/clients/new?organization=org-1&step=icp",
    );
  });

  it("confirms the profiles are in place when nothing is missing or blocking", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{ icpProfile: labelled, qualificationCriteria: {} }}
      />,
    );

    expect(screen.getByText("Profils en place")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows Beclose's own blockers in French, and a neutral line for a code it does not know", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{
          icpProfile: labelled,
          qualificationCriteria: {},
          sourcingReadiness: { ready: false, blockers: ["ICP_SECTOR_LABELS_MISSING", "BRAND_NEW_CODE"] },
        }}
      />,
    );

    expect(screen.getByText("Sourcing impossible")).toBeInTheDocument();
    expect(screen.getByText(/n’ont aucun libellé français/)).toBeInTheDocument();
    expect(screen.getByText("Précondition non remplie : BRAND_NEW_CODE")).toBeInTheDocument();
  });

  it("trusts Beclose when it says ready, whatever the local data looks like", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{
          icpProfile: noSector,
          qualificationCriteria: {},
          sourcingReadiness: { ready: true, blockers: [] },
        }}
      />,
    );

    expect(screen.getByText("Profils en place")).toBeInTheDocument();
  });

  it("warns when the ICP zone is not applied (Beclose: unsupported) without blocking the sourcing", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{
          icpProfile: labelled,
          qualificationCriteria: {},
          sourcingReadiness: {
            ready: true,
            blockers: [],
            geography: { status: "unsupported", regions: [], departements: [], unrecognized: ["Lyon"] },
          },
        }}
      />,
    );

    expect(screen.getByText("Profils en place")).toBeInTheDocument();
    expect(screen.getByText(/La zone de l’ICP \(Lyon\) n’est pas appliquée/)).toBeInTheDocument();
  });

  it("states the zone actually applied when restricted", () => {
    render(
      <ConfigurationStatusBanner
        workspaceId="org-1"
        configuration={{
          icpProfile: labelled,
          qualificationCriteria: {},
          sourcingReadiness: {
            ready: true,
            blockers: [],
            geography: { status: "restricted", regions: ["53"], departements: [], unrecognized: [] },
          },
        }}
      />,
    );

    expect(screen.getByText(/Zone appliquée : régions \(codes INSEE\) 53/)).toBeInTheDocument();
  });
});
