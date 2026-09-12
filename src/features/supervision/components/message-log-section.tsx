"use client";

import { useState } from "react";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import { PaginationControls } from "@/shared/ui/pagination";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useMessageLogQuery } from "../api/use-message-log-query";
import { MessageLogList } from "./message-log-list";

const PAGE_SIZE = 20;

export function MessageLogSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <MessageLogSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function MessageLogSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const [offset, setOffset] = useState(0);
  const query = useMessageLogQuery(workspaceId, { limit: PAGE_SIZE, offset });

  if (query.isPending) return <LoadingState label="Chargement des messages…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les messages" onRetry={() => void query.refetch()} />
    );
  }

  const { data, pagination } = query.data;

  return (
    <div className="space-y-4">
      <MessageLogList messages={data} />
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
