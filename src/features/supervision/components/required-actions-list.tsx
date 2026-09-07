import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import {
  supervisionPriorityLabels,
  type RequiredAction,
} from "../model/supervision";

interface RequiredActionsListProps {
  actions: readonly RequiredAction[];
  getWorkspaceName?: (workspaceId: string) => string | undefined;
  formatTimestamp: (timestamp: string) => string;
  renderAction?: (action: RequiredAction) => ReactNode;
}

export function RequiredActionsList({
  actions,
  getWorkspaceName,
  formatTimestamp,
  renderAction,
}: RequiredActionsListProps) {
  if (actions.length === 0) {
    return (
      <EmptyState
        title="Aucune intervention en attente"
        description="Les actions nécessitant une validation humaine apparaîtront ici."
      />
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-app-lg border border-border bg-surface">
      {actions.map((action) => {
        const workspaceName = getWorkspaceName?.(action.workspaceId);
        return (
          <li key={action.id} className="border-l-2 border-l-brand-blue-violet/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">{action.title}</h3>
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-secondary">
                    {supervisionPriorityLabels[action.priority]}
                  </span>
                </div>
                {workspaceName === undefined ? null : (
                  <p className="mt-1 text-sm font-medium text-text-secondary">{workspaceName}</p>
                )}
                {action.reason === undefined ? null : (
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{action.reason}</p>
                )}
                {action.occurredAt === undefined ? null : (
                  <time dateTime={action.occurredAt} className="mt-2 block text-xs text-text-tertiary">
                    {formatTimestamp(action.occurredAt)}
                  </time>
                )}
              </div>
              {renderAction?.(action)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
