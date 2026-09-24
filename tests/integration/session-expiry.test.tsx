import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequireSession, SessionProvider, useSession, type AuthApi } from "@/features/auth";
import { ApiError } from "@/shared/api/api-error";

/**
 * Audit C04 (2026-09-24): a 401 on any request after a successful login left
 * the page on a generic "Réessayer" error forever, the session still shown as
 * valid. A 401 is now handled centrally: the session becomes EXPIRED, the
 * workspace data cached under it is dropped, and the user is sent back to the
 * login page with the page they were on as return target.
 */
const routerReplace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: routerReplace, push: vi.fn() }),
}));

const session = { user: { id: "u1", email: "a@b.com", displayName: "Ada Lovelace" } };
const neverCalled = () => {
  throw new Error("should not be called in this scenario");
};
const authApi: AuthApi = {
  getCurrentSession: async () => session,
  login: async () => session,
  logout: neverCalled,
  requestPasswordReset: neverCalled,
  resetPassword: neverCalled,
};

const unauthorized = () =>
  new ApiError({ kind: "http", message: "401", status: 401, details: { error: { code: "UNAUTHENTICATED" } } });

function ClientsProbe({ fail }: { fail: () => Promise<never> }) {
  const query = useQuery({ queryKey: ["workspaces"], queryFn: fail });
  return <p>{query.isError ? "erreur générique" : "chargement"}</p>;
}

function ArchiveProbe({ fail }: { fail: () => Promise<never> }) {
  const mutation = useMutation({ mutationFn: fail });
  return <button onClick={() => mutation.mutate()}>agir</button>;
}

function StatusProbe() {
  const { state } = useSession();
  return <p data-testid="status">{state.status}</p>;
}

function renderTree(children: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider authApi={authApi}>
        <StatusProbe />
        <RequireSession>{children}</RequireSession>
      </SessionProvider>
    </QueryClientProvider>,
  );
  return queryClient;
}

describe("session expiry (401 handled centrally)", () => {
  beforeEach(() => {
    routerReplace.mockClear();
    window.history.pushState({}, "", "/backoffice/clients?includeArchived=true");
  });

  it("a 401 on a query expires the session, drops cached data and redirects to login with a return target", async () => {
    const queryClient = renderTree(<ClientsProbe fail={() => Promise.reject(unauthorized())} />);
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED"));

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("EXPIRED"));
    expect(screen.queryByText("erreur générique")).not.toBeInTheDocument();
    expect(queryClient.getQueryCache().find({ queryKey: ["workspaces"] })).toBeUndefined();
    await waitFor(() =>
      expect(routerReplace).toHaveBeenCalledWith(
        "/login?redirectTo=%2Fbackoffice%2Fclients%3FincludeArchived%3Dtrue",
      ),
    );
  });

  it("a 401 on a mutation expires the session the same way", async () => {
    renderTree(<ArchiveProbe fail={() => Promise.reject(unauthorized())} />);
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED"));

    await userEvent.click(screen.getByRole("button", { name: "agir" }));

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("EXPIRED"));
    await waitFor(() => expect(routerReplace).toHaveBeenCalledTimes(1));
  });

  it("other failures (500, 409) leave the session untouched", async () => {
    renderTree(
      <ClientsProbe
        fail={() => Promise.reject(new ApiError({ kind: "http", message: "500", status: 500 }))}
      />,
    );
    await waitFor(() => expect(screen.getByText("erreur générique")).toBeInTheDocument());

    expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    expect(routerReplace).not.toHaveBeenCalled();
  });
});
