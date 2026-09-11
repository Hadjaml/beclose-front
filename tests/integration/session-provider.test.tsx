import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SessionProvider, useSession, type AuthApi } from "@/features/auth";

function Harness() {
  const { state, login, logout } = useSession();
  return (
    <div>
      <p data-testid="status">{state.status}</p>
      {state.status === "AUTHENTICATED" ? (
        <p data-testid="user">{state.session.user.displayName}</p>
      ) : null}
      <button onClick={() => void login({ email: "a@b.com", password: "secret" }).catch(() => {})}>
        login
      </button>
      <button onClick={() => void logout().catch(() => {})}>logout</button>
    </div>
  );
}

function renderWithProviders(authApi: AuthApi) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider authApi={authApi}>
        <Harness />
      </SessionProvider>
    </QueryClientProvider>,
  );
}

const session = { user: { id: "u1", email: "a@b.com", displayName: "Ada Lovelace" } };
const neverCalled = () => {
  throw new Error("should not be called in this scenario");
};

describe("SessionProvider", () => {
  it("bootstraps to UNKNOWN then UNAUTHENTICATED when there is no session", async () => {
    renderWithProviders({
      getCurrentSession: async () => null,
      login: neverCalled,
      logout: neverCalled,
      requestPasswordReset: neverCalled,
      resetPassword: neverCalled,
    });

    expect(screen.getByTestId("status")).toHaveTextContent("UNKNOWN");
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED"));
  });

  it("bootstraps to AUTHENTICATED when a session already exists", async () => {
    renderWithProviders({
      getCurrentSession: async () => session,
      login: neverCalled,
      logout: neverCalled,
      requestPasswordReset: neverCalled,
      resetPassword: neverCalled,
    });

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED"));
    expect(screen.getByTestId("user")).toHaveTextContent("Ada Lovelace");
  });

  it("login() moves the state to AUTHENTICATED", async () => {
    renderWithProviders({
      getCurrentSession: async () => null,
      login: async () => session,
      logout: neverCalled,
      requestPasswordReset: neverCalled,
      resetPassword: neverCalled,
    });

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED"));
    screen.getByText("login").click();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED"));
  });

  it("logout() moves the state back to UNAUTHENTICATED even when the backend call fails", async () => {
    renderWithProviders({
      getCurrentSession: async () => session,
      login: neverCalled,
      logout: async () => {
        throw new Error("network down");
      },
      requestPasswordReset: neverCalled,
      resetPassword: neverCalled,
    });

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED"));
    screen.getByText("logout").click();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED"));
  });
});
