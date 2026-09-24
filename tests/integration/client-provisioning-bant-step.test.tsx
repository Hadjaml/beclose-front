import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { bantCriteriaWireSchema } from "@/features/client-configuration";
import { bantCriteriaWire } from "../support/criteria-wire-fixtures";
import { BantStep } from "@/features/client-provisioning/components/steps/bant-step";

/** Same bug as icp-step (see that test file's comment): `profileName` was
 * never bound to any visible field here either — `BantStep` had its own
 * separate, disconnected `name` local state. */
const startMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/client-configuration", async () => {
  const actual = await vi.importActual<typeof import("@/features/client-configuration")>(
    "@/features/client-configuration",
  );
  return {
    ...actual,
    useCreateBantCriteriaVersionMutation: () => useMutation({ mutationFn: startMock }),
  };
});

function renderBantStep(onCreated = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return {
    onCreated,
    ...render(
      <QueryClientProvider client={queryClient}>
        <BantStep workspaceId="workspace-1" workspaceName="Acme" onCreated={onCreated} />
      </QueryClientProvider>,
    ),
  };
}

describe("BantStep (client-provisioning)", () => {
  it("submits successfully once every required field (including previously-invisible profileName) is filled", async () => {
    const user = userEvent.setup();
    startMock.mockClear();
    startMock.mockResolvedValueOnce({
      id: "bant-1",
      name: "Grille BANT Acme",
      version: 1,
      status: "active",
      activatedAt: null,
      createdAt: "2026-09-23T00:00:00Z",
    });
    const { onCreated } = renderBantStep();

    // profileName ("Nom de cette version") is pre-filled by default from
    // workspaceName; only the four criteria definitions have no safe
    // default and are genuinely required.
    await user.type(screen.getByLabelText("Définition", { selector: "#bant-budget-definition" }), "d1");
    await user.type(screen.getByLabelText("Définition", { selector: "#bant-authority-definition" }), "d2");
    await user.type(screen.getByLabelText("Définition", { selector: "#bant-need-definition" }), "d3");
    await user.type(screen.getByLabelText("Définition", { selector: "#bant-timing-definition" }), "d4");

    await user.click(screen.getByRole("button", { name: "Créer" }));

    await waitFor(() => expect(startMock).toHaveBeenCalledTimes(1));
    const [request] = startMock.mock.calls[0] as [{ name: string; criteria: { profileName: string } }];
    expect(request.name).toBe("Grille BANT Acme");
    expect(request.criteria.profileName).toBe("Grille BANT Acme");
    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    // Still on screen until the configuration is refetched: a second click
    // must not create one more version (audit A06/A07).
    expect(screen.getByRole("button", { name: "Création…" })).toBeDisabled();
  }, 20_000);

  it("lists every failing field in the validation banner when required fields are left blank", async () => {
    const user = userEvent.setup();
    startMock.mockClear();
    renderBantStep();

    await user.click(screen.getByRole("button", { name: "Créer" }));

    expect(startMock).not.toHaveBeenCalled();
    expect(screen.getByText("Informations manquantes ou invalides")).toBeInTheDocument();
    expect(screen.getByText(/budget.*definition/)).toBeInTheDocument();
  });

  it("submitting an untouched prefilled form creates a new version identical to the active one, nothing dropped", async () => {
    const user = userEvent.setup();
    startMock.mockClear();
    startMock.mockResolvedValueOnce({
      id: "v-2",
      name: "Actif",
      version: 4,
      status: "active",
      activatedAt: null,
      createdAt: "2026-09-24T00:00:00Z",
    });
    const active = bantCriteriaWireSchema.parse(bantCriteriaWire);
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <BantStep
          workspaceId="workspace-1"
          workspaceName="Acme"
          activeVersion={{ version: 3, name: "Actif", criteria: active }}
          onCreated={vi.fn()}
        />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: /Créer/ }));

    await waitFor(() => expect(startMock).toHaveBeenCalledTimes(1));
    const [request] = startMock.mock.calls[0] as [{ name: string; criteria: unknown }];
    expect(request.name).toBe("Actif");
    expect(request.criteria).toEqual({ ...active, profileName: "Actif" });
  }, 20_000);
});
