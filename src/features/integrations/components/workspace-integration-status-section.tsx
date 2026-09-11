"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspaceIntegrationStatusQuery } from "../api/use-workspace-integration-status-query";
import { WorkspaceIntegrationStatusView } from "./workspace-integration-status-view";

export function WorkspaceIntegrationStatusSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <WorkspaceIntegrationStatusSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function WorkspaceIntegrationStatusSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceIntegrationStatusQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement des intégrations…" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Impossible de charger les intégrations"
        onRetry={() => void query.refetch()}
      />
    );
  }
  return <WorkspaceIntegrationStatusView status={query.data} />;
}
