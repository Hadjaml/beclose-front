"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useMessageLogQuery } from "../api/use-message-log-query";
import { MessageLogList } from "./message-log-list";

export function MessageLogSection({
  leadId,
  highlightedMessageId,
}: {
  /** Scopes the log to one lead — used by the prospect detail view. Leave
   * unset for the workspace-wide conversations page. */
  leadId?: string;
  highlightedMessageId?: string;
} = {}) {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return (
    <MessageLogSectionForWorkspace
      workspaceId={activeWorkspaceId}
      {...(leadId === undefined ? {} : { leadId })}
      {...(highlightedMessageId === undefined ? {} : { highlightedMessageId })}
    />
  );
}

function MessageLogSectionForWorkspace({
  workspaceId,
  leadId,
  highlightedMessageId,
}: {
  workspaceId: WorkspaceId;
  leadId?: string;
  highlightedMessageId?: string;
}) {
  const query = useMessageLogQuery(workspaceId, leadId === undefined ? {} : { leadId });

  if (query.isPending) return <LoadingState label="Chargement des messages…" />;
  if (query.isError) {
    return (
      <ErrorState title="Impossible de charger les messages" onRetry={() => void query.refetch()} />
    );
  }
  return (
    <MessageLogList
      messages={query.data.data}
      {...(highlightedMessageId === undefined ? {} : { highlightedMessageId })}
    />
  );
}
