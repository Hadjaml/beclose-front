"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { backendClient } from "@/shared/api/backend-client";
import { ApiError, normalizeApiError } from "@/shared/api/api-error";
import { globalKeys } from "@/shared/query/query-keys";
import { createAuthApi, type AuthApi } from "../api/auth-api";
import type { LoginCredentials } from "../model/session";
import type { SessionState } from "../model/session-state";

const defaultAuthApi = createAuthApi(backendClient);

interface SessionContextValue {
  state: SessionState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  retrySessionCheck: () => void;
  isLoggingIn: boolean;
  loginError: string | undefined;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  authApi = defaultAuthApi,
}: {
  children: ReactNode;
  authApi?: AuthApi;
}) {
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [expired, setExpired] = useState(false);

  const sessionQuery = useQuery({
    queryKey: globalKeys.session(),
    queryFn: ({ signal }) => authApi.getCurrentSession(signal),
  });

  // Central 401 handling: any query or mutation refused with 401 while a
  // session is held means the session is gone server-side. Without this the
  // page kept showing a generic "Réessayer" that could never succeed.
  useEffect(() => {
    const sessionKey = globalKeys.session();
    const sessionKeyJson = JSON.stringify(sessionKey);

    function expireSession() {
      if (!queryClient.getQueryData(sessionKey)) return;
      setExpired(true);
      // Deferred: this runs inside a cache notification, and removing the
      // very query that just failed synchronously would re-enter the cache.
      queueMicrotask(() => {
        queryClient.removeQueries({
          predicate: (query) => JSON.stringify(query.queryKey) !== sessionKeyJson,
        });
        queryClient.setQueryData(sessionKey, null);
      });
    }

    const isUnauthorized = (error: unknown) => error instanceof ApiError && error.status === 401;

    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.action.type === "error" &&
        JSON.stringify(event.query.queryKey) !== sessionKeyJson &&
        isUnauthorized(event.action.error)
      ) {
        expireSession();
      }
    });
    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.action.type === "error" &&
        isUnauthorized(event.action.error)
      ) {
        expireSession();
      }
    });
    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoggingIn(true);
      setLoginError(undefined);
      try {
        const session = await authApi.login(credentials);
        setExpired(false);
        queryClient.setQueryData(globalKeys.session(), session);
      } catch (error) {
        const normalized = normalizeApiError(error);
        setLoginError(
          normalized.status === 401
            ? "Identifiants invalides."
            : "Connexion impossible. Réessayez dans quelques instants.",
        );
        throw normalized;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [authApi, queryClient],
  );

  const logout = useCallback(async () => {
    setExpired(false);
    try {
      await authApi.logout();
    } finally {
      // Drop everything cached except the session key itself: it's either
      // session-derived or workspace-scoped, none of it should leak into
      // the next login. Removing (rather than excluding) the session key
      // too would make its still-mounted useQuery observer immediately
      // refetch — a race that can resolve *after* the setQueryData below
      // and silently put AUTHENTICATED back (verified for real: this was
      // the original, broken approach, see git history on this line).
      const sessionKey = globalKeys.session();
      const sessionKeyJson = JSON.stringify(sessionKey);
      queryClient.removeQueries({
        predicate: (query) => JSON.stringify(query.queryKey) !== sessionKeyJson,
      });
      // Forget the session locally even if the server call failed (network
      // blip) — staying "logged in" in the UI while the user asked to leave
      // is worse than a stale server-side session that expires on its own.
      queryClient.setQueryData(sessionKey, null);
    }
  }, [authApi, queryClient]);

  const retrySessionCheck = useCallback(() => {
    void sessionQuery.refetch();
  }, [sessionQuery]);

  const state: SessionState = sessionQuery.isPending
    ? { status: "UNKNOWN" }
    : sessionQuery.isError
      ? { status: "ERROR", error: normalizeApiError(sessionQuery.error) }
      : sessionQuery.data === null
        ? expired
          ? { status: "EXPIRED" }
          : { status: "UNAUTHENTICATED" }
        : { status: "AUTHENTICATED", session: sessionQuery.data };

  const value: SessionContextValue = {
    state,
    login,
    logout,
    retrySessionCheck,
    isLoggingIn,
    loginError,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
