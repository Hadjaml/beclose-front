"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "@/shared/api/api-error";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // One retry for a transient failure, but never for a 401: the session
        // is gone and only a new login can fix it (see SessionProvider).
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status === 401) && failureCount < 1,
        // Default "online" networkMode pauses queries (fetchStatus stays
        // "paused", never fires, never errors) whenever the browser reports
        // navigator.onLine === false. This app has no offline-first UX to
        // pause for, and headless Chromium in CI can report itself offline
        // - confirmed for real as the cause of a stuck-forever session
        // query (RequireSession's nav never rendering in e2e, a downloaded
        // Playwright trace showed zero network attempt ever made for
        // GET /auth/me, no matter how long the test waited).
        networkMode: "always",
      },
      mutations: { retry: 0, networkMode: "always" },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
