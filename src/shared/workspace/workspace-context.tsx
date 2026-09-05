"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "./workspace";

interface WorkspaceContextValue {
  activeWorkspaceId: WorkspaceId | null;
  setActiveWorkspaceId: (workspaceId: WorkspaceId | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
  initialWorkspaceId?: WorkspaceId | null;
}

export function WorkspaceProvider({ children, initialWorkspaceId = null }: WorkspaceProviderProps) {
  const queryClient = useQueryClient();
  const [activeWorkspaceId, setWorkspaceId] = useState<WorkspaceId | null>(initialWorkspaceId);

  const setActiveWorkspaceId = useCallback(
    (nextWorkspaceId: WorkspaceId | null) => {
      setWorkspaceId((previousWorkspaceId) => {
        if (previousWorkspaceId !== null && previousWorkspaceId !== nextWorkspaceId) {
          void queryClient.cancelQueries({ queryKey: workspaceKeys.scope(previousWorkspaceId) });
          queryClient.removeQueries({ queryKey: workspaceKeys.scope(previousWorkspaceId) });
        }
        return nextWorkspaceId;
      });
    },
    [queryClient],
  );

  return (
    <WorkspaceContext.Provider value={{ activeWorkspaceId, setActiveWorkspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (context === null) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
