"use client";

import { useWorkspace } from "@/shared/workspace/workspace-context";
import { StartSourcingRunButton } from "./start-sourcing-run-button";

export function SourcingRunSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <StartSourcingRunButton workspaceId={activeWorkspaceId} />;
}
