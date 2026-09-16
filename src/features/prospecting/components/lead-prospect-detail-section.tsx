"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadProspectDetailQuery } from "../api/use-lead-prospect-detail-query";
import { LeadProspectDetailView } from "./lead-prospect-detail-view";

export function LeadProspectDetailSection({
  workspaceId,
  leadId,
}: {
  workspaceId: WorkspaceId;
  leadId: string;
}) {
  const query = useLeadProspectDetailQuery(workspaceId, leadId);

  if (query.isPending) return <LoadingState label="Chargement du prospect…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger ce prospect" onRetry={() => void query.refetch()} />
    );
  }
  return <LeadProspectDetailView prospect={query.data} />;
}
