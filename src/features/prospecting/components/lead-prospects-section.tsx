"use client";

import { useState } from "react";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { PaginationControls } from "@/shared/ui/pagination";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useLeadProspectsQuery } from "../api/use-lead-prospects-query";
import { LeadProspectsList } from "./lead-prospects-list";

const PAGE_SIZE = 20;

export function LeadProspectsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <LeadProspectsSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function LeadProspectsSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const [offset, setOffset] = useState(0);
  const query = useLeadProspectsQuery(workspaceId, { limit: PAGE_SIZE, offset });

  if (query.isPending) return <LoadingState label="Chargement des prospects…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les prospects" onRetry={() => void query.refetch()} />
    );
  }

  const { data, pagination } = query.data;

  return (
    <div className="space-y-4">
      <LeadProspectsList prospects={data} />
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
