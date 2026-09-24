"use client";

import { useState } from "react";
import { useLeadProspectsQuery } from "@/features/prospecting";
import { useMessageLogQuery } from "@/features/supervision";
import { formatDateTime } from "@/shared/format/format-date-time";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import { summarizeConversations, type ConversationSummary } from "../model/conversation-summaries";
import { ChatThread } from "./chat-thread";

const MAX_PAGE = 200;

export function ProspectConversationsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <ProspectConversations workspaceId={activeWorkspaceId} />;
}

function ProspectConversations({ workspaceId }: { workspaceId: WorkspaceId }) {
  const messages = useMessageLogQuery(workspaceId, { limit: MAX_PAGE });
  const prospects = useLeadProspectsQuery(workspaceId, { limit: MAX_PAGE });
  const [selectedLeadId, setSelectedLeadId] = useState<string>();

  if (messages.isPending) return <LoadingState label="Chargement des conversations…" />;
  if (messages.isError) {
    return (
      <ErrorState title="Impossible de charger les conversations" onRetry={() => void messages.refetch()} />
    );
  }

  const summaries = summarizeConversations(
    messages.data.data,
    prospects.isSuccess ? prospects.data.data : [],
  );
  if (summaries.length === 0) {
    return (
      <EmptyState
        title="Aucun message échangé pour le moment"
        description="Les conversations avec les prospects apparaissent dès qu’un message est généré ou reçu."
      />
    );
  }

  const active = summaries.find((summary) => summary.leadId === selectedLeadId) ?? summaries[0];
  const truncated = messages.data.pagination.total > messages.data.data.length;

  return (
    <div className="space-y-3">
      {truncated ? (
        <p className="text-sm text-text-secondary">
          Seuls les {messages.data.data.length} messages les plus récents sont chargés : les
          conversations plus anciennes peuvent manquer.
        </p>
      ) : null}
      <div className="grid items-start gap-4 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <ol aria-label="Conversations" className="divide-y divide-border overflow-hidden rounded-app-lg border border-border bg-surface">
          {summaries.map((summary) => (
            <li key={summary.leadId}>
              <ConversationEntry
                summary={summary}
                active={summary.leadId === active?.leadId}
                onSelect={() => setSelectedLeadId(summary.leadId)}
              />
            </li>
          ))}
        </ol>
        {active === undefined ? null : (
          <ThreadPanel key={active.leadId} workspaceId={workspaceId} summary={active} />
        )}
      </div>
    </div>
  );
}

function ConversationEntry({
  summary,
  active,
  onSelect,
}: {
  summary: ConversationSummary;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`block w-full px-4 py-3 text-left hover:bg-surface-muted ${active ? "bg-brand-blue-violet/5" : ""}`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-semibold text-text-primary">{summary.title}</span>
        <span className="shrink-0 text-xs text-text-tertiary">{formatDateTime(summary.lastAt)}</span>
      </span>
      {summary.subtitle === null ? null : (
        <span className="block truncate text-xs text-text-tertiary">{summary.subtitle}</span>
      )}
      <span className="mt-1 block truncate text-sm text-text-secondary">{summary.lastPreview}</span>
    </button>
  );
}

function ThreadPanel({ workspaceId, summary }: { workspaceId: WorkspaceId; summary: ConversationSummary }) {
  const thread = useMessageLogQuery(workspaceId, { leadId: summary.leadId, limit: MAX_PAGE });

  return (
    <section
      aria-label={`Conversation avec ${summary.title}`}
      className="min-h-64 rounded-app-lg border border-border bg-surface"
    >
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-base font-semibold text-text-primary">{summary.title}</h2>
        {summary.subtitle === null ? null : (
          <p className="text-sm text-text-secondary">{summary.subtitle}</p>
        )}
      </header>
      {thread.isPending ? <LoadingState label="Chargement de la conversation…" /> : null}
      {thread.isError ? (
        <ErrorState title="Impossible de charger cette conversation" onRetry={() => void thread.refetch()} />
      ) : null}
      {thread.isSuccess ? <ChatThread messages={thread.data.data} /> : null}
    </section>
  );
}
