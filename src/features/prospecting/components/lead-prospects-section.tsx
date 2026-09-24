"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/shared/query/query-keys";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { PaginationControls } from "@/shared/ui/pagination";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadProspectsQuery } from "../api/use-lead-prospects-query";
import {
  SOURCING_RUN_POLL_INTERVAL_MS,
  useSourcingRunsQuery,
} from "../api/use-sourcing-runs-query";
import { LeadProspectsList } from "./lead-prospects-list";

const PAGE_SIZE = 20;

export function LeadProspectsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <LeadProspectsSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function LeadProspectsSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const [offset, setOffset] = useState(0);
  // Leads arrive company by company while a sourcing run is in progress:
  // refresh the list on the same cadence as the runs list, and once more
  // when the run ends (the last leads land right before it flips to done).
  const isSourcingRunning =
    useSourcingRunsQuery(workspaceId).data?.some((run) => run.status === "running") === true;
  const query = useLeadProspectsQuery(
    workspaceId,
    { limit: PAGE_SIZE, offset },
    { refetchIntervalMs: isSourcingRunning ? SOURCING_RUN_POLL_INTERVAL_MS : false },
  );
  const queryClient = useQueryClient();
  const wasRunning = useRef(false);
  useEffect(() => {
    if (wasRunning.current && !isSourcingRunning) {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "lead-prospects"),
      });
    }
    wasRunning.current = isSourcingRunning;
  }, [isSourcingRunning, queryClient, workspaceId]);

  if (query.isPending) return <LoadingState label="Chargement des prospects…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les prospects" onRetry={() => void query.refetch()} />
    );
  }

  const { data, pagination } = query.data;

  return (
    <div className="space-y-4">
      <LeadProspectsList prospects={data} workspaceId={workspaceId} />
      {pagination.total > pagination.limit ? (
        <PaginationControls
          limit={pagination.limit}
          offset={pagination.offset}
          total={pagination.total}
          onPrevious={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
          onNext={() => setOffset((current) => current + PAGE_SIZE)}
        />
      ) : null}
    </div>
  );
}
