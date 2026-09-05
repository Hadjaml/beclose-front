"use client";

import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/shared/workspace/workspace-context";
import { QueryProvider } from "./query-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </QueryProvider>
  );
}
