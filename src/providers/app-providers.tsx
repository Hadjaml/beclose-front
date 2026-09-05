"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/features/auth";
import { WorkspaceProvider } from "@/shared/workspace/workspace-context";
import { QueryProvider } from "./query-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
