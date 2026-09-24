"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import {
  useApprovalMetricsQuery,
  usePrecisionQuery,
} from "../api/use-workspace-performance-queries";
import { ApprovalMetricsView } from "./approval-metrics-view";
import { PrecisionView } from "./precision-view";

export function WorkspacePerformanceSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <WorkspacePerformanceSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function WorkspacePerformanceSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const precision = usePrecisionQuery(workspaceId);
  const approval = useApprovalMetricsQuery(workspaceId);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Précision des leads transmis</h2>
        {precision.isPending ? <LoadingState label="Chargement de la précision…" /> : null}
        {precision.isError ? (
          <ErrorState title="Impossible de charger la précision" onRetry={() => void precision.refetch()} />
        ) : null}
        {precision.isSuccess ? <PrecisionView precision={precision.data} /> : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Correction des messages</h2>
        {approval.isPending ? <LoadingState label="Chargement du taux de correction…" /> : null}
        {approval.isError ? (
          <ErrorState title="Impossible de charger le taux de correction" onRetry={() => void approval.refetch()} />
        ) : null}
        {approval.isSuccess ? <ApprovalMetricsView metrics={approval.data} /> : null}
      </section>
    </div>
  );
}
