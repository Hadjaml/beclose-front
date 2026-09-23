import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrganizationStep } from "@/features/client-provisioning/components/steps/organization-step";

/**
 * Reproduces, end to end through real app code (real Zod validation, real
 * `useStepForm`, real `useMutation`), the exact click → submit → create flow
 * Rochinel reported broken on 2026-09-23 ("cliquer sur Créer et continuer
 * ne fait rien"). Only the network layer is faked — `backendClient`'s
 * module-level singleton is mocked outright (`vi.mock`, hoisted above every
 * import by Vitest) rather than stubbing global `fetch`, which would be too
 * late: `createApiClient` captures `fetch` once, at import time, well
 * before any per-test `vi.stubGlobal` could take effect. A first version of
 * this test stubbed global fetch too late and accidentally hit the real
 * local Beclose API instead, unauthenticated — which did at least confirm
 * end to end that a real click reaches a real network call, and that a 401
 * response renders "Session expirée" correctly.
 *
 * A direct `curl` reproduction against the real running Beclose API (real
 * staff session, exact payload this code sends) already confirmed
 * `POST /organizations` itself accepts this request and returns 201 — this
 * test is to catch a front-end-only regression that curl repro can't see.
 */
const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("@/shared/api/backend-client", async () => {
  const { createApiClient } = await import("@/shared/api/api-client");
  return {
    backendClient: createApiClient({ baseUrl: "http://localhost:8000", fetchImplementation: fetchMock }),
  };
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function renderOrganizationStep(onCreated: (workspaceId: string, name: string) => void) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <OrganizationStep onCreated={onCreated} />
    </QueryClientProvider>,
  );
}

describe("OrganizationStep (client-provisioning)", () => {
  it("submits the real form and calls onCreated on a successful POST /organizations", async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    fetchMock.mockClear();
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, {
        data: {
          id: "org-1",
          name: "Acme",
          pitch: null,
          signature: null,
          telegramChatId: null,
          createdAt: "2026-09-23T00:00:00Z",
          updatedAt: "2026-09-23T00:00:00Z",
        },
      }),
    );

    renderOrganizationStep(onCreated);

    await user.type(screen.getByLabelText("Nom"), "Acme");
    await user.click(screen.getByRole("button", { name: "Créer et continuer" }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("org-1", "Acme"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(url)).toContain("/organizations");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      name: "Acme",
      pitch: null,
      signature: null,
      telegramChatId: null,
    });
  });

  it("does not call the API and shows an inline error when the name is left blank", async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    fetchMock.mockClear();

    renderOrganizationStep(onCreated);

    await user.click(screen.getByRole("button", { name: "Créer et continuer" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onCreated).not.toHaveBeenCalled();
    expect(await screen.findByText("Informations manquantes ou invalides")).toBeInTheDocument();
  });

  it("shows the mutation error banner and does not call onCreated when the API rejects", async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    fetchMock.mockClear();
    fetchMock.mockResolvedValueOnce(
      jsonResponse(401, { error: { code: "UNAUTHENTICATED", message: "Non authentifié." } }),
    );

    renderOrganizationStep(onCreated);

    await user.type(screen.getByLabelText("Nom"), "Acme");
    await user.click(screen.getByRole("button", { name: "Créer et continuer" }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(onCreated).not.toHaveBeenCalled();
  });
});
