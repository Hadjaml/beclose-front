"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useMessageLogQuery } from "../api/use-message-log-query";
import { MessageLogList } from "./message-log-list";

export function MessageLogSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <MessageLogSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function MessageLogSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useMessageLogQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement des messages…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les messages" onRetry={() => void query.refetch()} />
    );
  }
  return <MessageLogList messages={query.data.data} />;
}
