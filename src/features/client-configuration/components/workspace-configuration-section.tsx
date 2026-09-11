"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspaceConfigurationQuery } from "../api/use-workspace-configuration-query";
import { WorkspaceConfigurationView } from "./workspace-configuration-view";

export function WorkspaceConfigurationSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <WorkspaceConfigurationSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function WorkspaceConfigurationSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceConfigurationQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement de la configuration…" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Impossible de charger la configuration"
        onRetry={() => void query.refetch()}
      />
    );
  }
  return <WorkspaceConfigurationView configuration={query.data} />;
}
