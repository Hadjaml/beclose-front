"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadProspectsQuery } from "../api/use-lead-prospects-query";
import { LeadProspectsList } from "./lead-prospects-list";

export function LeadProspectsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <LeadProspectsSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function LeadProspectsSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useLeadProspectsQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement des prospects…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les prospects" onRetry={() => void query.refetch()} />
    );
  }
  return <LeadProspectsList prospects={query.data.data} />;
}
