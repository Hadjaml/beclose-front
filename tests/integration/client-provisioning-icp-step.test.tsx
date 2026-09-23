import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IcpStep } from "@/features/client-provisioning/components/steps/icp-step";

/**
 * Reproduces the real blocking bug Rochinel hit on 2026-09-23: every
 * visible field filled in, "Créer et continuer" clicked, nothing
 * happened — no field pointed at as the problem. Root cause:
 * `IcpCriteriaFormValue.profileName` was never bound to any visible field
 * (a separate, disconnected `name` local state was used instead, only
 * merged back in *after* validation had already run and failed) — Zod
 * validation always rejected the empty `profileName`, silently, no matter
 * what the user filled in. Fixed by binding the "Nom de cette version"
 * field directly to `draft.profileName`.
 *
 * This test fills every *other* required field that has no safe default
 * (`purpose`, `commercialMaturity.preferredLevel` — the rest of the form's
 * required fields are numbers/booleans/arrays that always have a valid
 * default) and asserts the mutation actually fires — i.e. validation
 * genuinely passes end to end, not just that some field displays an error.
 */
const startMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/client-configuration", async () => {
  const actual = await vi.importActual<typeof import("@/features/client-configuration")>(
    "@/features/client-configuration",
  );
  return {
    ...actual,
    useCreateIcpProfileVersionMutation: () => useMutation({ mutationFn: startMock }),
  };
});

function renderIcpStep(onCreated = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return {
    onCreated,
    ...render(
      <QueryClientProvider client={queryClient}>
        <IcpStep workspaceId="workspace-1" workspaceName="Acme" onCreated={onCreated} />
      </QueryClientProvider>,
    ),
  };
}

describe("IcpStep (client-provisioning)", () => {
  it("submits successfully once every required field (including previously-invisible profileName) is filled", async () => {
    const user = userEvent.setup();
    startMock.mockResolvedValueOnce({
      id: "icp-1",
      name: "Profil ICP Acme",
      version: 1,
      status: "active",
      activatedAt: null,
      createdAt: "2026-09-23T00:00:00Z",
    });
    const { onCreated } = renderIcpStep();

    // profileName ("Nom de cette version") is pre-filled by default from
    // workspaceName — the real bug was that this default never actually
    // reached the validated draft. Only purpose and a commercial maturity
    // level (required for preferredLevel) need filling.
    await user.type(screen.getByLabelText("Objet de ce profil"), "Cibler les PME B2B.");
    await user.click(screen.getByRole("button", { name: "Ajouter un niveau" }));
    await user.type(screen.getByLabelText("Clé du niveau"), "structure");
    await user.type(screen.getByLabelText("Définition"), "Process commercial en place");
    await user.selectOptions(screen.getByLabelText("Niveau idéal"), "structure");

    await user.click(screen.getByRole("button", { name: "Créer et continuer" }));

    await waitFor(() => expect(startMock).toHaveBeenCalledTimes(1));
    const [request] = startMock.mock.calls[0] as [{ name: string; criteria: { profileName: string; purpose: string } }];
    expect(request.name).toBe("Profil ICP Acme");
    expect(request.criteria.profileName).toBe("Profil ICP Acme");
    expect(request.criteria.purpose).toBe("Cibler les PME B2B.");
    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
  });

  it("lists every failing field in the validation banner when required fields are left blank", async () => {
    const user = userEvent.setup();
    startMock.mockClear();
    renderIcpStep();

    await user.click(screen.getByRole("button", { name: "Créer et continuer" }));

    expect(startMock).not.toHaveBeenCalled();
    expect(screen.getByText("Informations manquantes ou invalides")).toBeInTheDocument();
    // The previously-invisible field must now show up explicitly.
    expect(screen.getByText(/purpose/)).toBeInTheDocument();
  });
});
