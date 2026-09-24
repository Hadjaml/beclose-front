"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadProspectDetailQuery } from "../api/use-lead-prospect-detail-query";
import { DraftRegenerationPanel } from "./draft-regeneration-panel";
import { LeadOutcomePanel } from "./lead-outcome-panel";
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
  return (
    <div className="space-y-8">
      <LeadOutcomePanel
        workspaceId={workspaceId}
        leadId={leadId}
        status={query.data.status}
        outcome={query.data.outcome}
        outcomeAt={query.data.outcomeAt}
      />
      <DraftRegenerationPanel
        workspaceId={workspaceId}
        leadId={leadId}
        draftRegeneration={query.data.draftRegeneration}
      />
      <LeadProspectDetailView prospect={query.data} />
    </div>
  );
}
