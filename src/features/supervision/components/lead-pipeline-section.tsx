"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadPipelineQuery } from "../api/use-lead-pipeline-query";
import { LeadPipelineSummary } from "./lead-pipeline-summary";

/** Reads the active workspace from context (URL-derived, see
 * `BackofficeWorkspaceLayout`) rather than taking it as a prop. */
export function LeadPipelineSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <LeadPipelineSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function LeadPipelineSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useLeadPipelineQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement du pipeline…" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Impossible de charger le pipeline"
        onRetry={() => void query.refetch()}
      />
    );
  }
  return <LeadPipelineSummary pipeline={query.data} />;
}
