import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import {
  supervisionPriorityLabels,
  type WorkspaceSupervisionSummary,
} from "../model/supervision";
import { SystemStatusBadge } from "./system-status-badge";

interface WorkspaceSupervisionListProps {
  workspaces: readonly WorkspaceSupervisionSummary[];
  formatTimestamp: (timestamp: string) => string;
  renderAction?: (workspace: WorkspaceSupervisionSummary) => ReactNode;
}

export function WorkspaceSupervisionList({
  workspaces,
  formatTimestamp,
  renderAction,
}: WorkspaceSupervisionListProps) {
  if (workspaces.length === 0) {
    return <EmptyState title="Aucun workspace à superviser" />;
  }

  return (
    <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">État</th>
            <th className="px-4 py-3">Attention</th>
            <th className="px-4 py-3">Progression / activité</th>
            <th className="px-4 py-3">Résultat principal</th>
            <th className="px-4 py-3"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {workspaces.map((workspace) => (
            <tr key={workspace.workspaceId}>
              <td className="px-4 py-4 font-semibold text-text-primary">{workspace.workspaceName}</td>
              <td className="px-4 py-4"><SystemStatusBadge status={workspace.systemStatus} /></td>
              <td className="px-4 py-4 text-text-secondary">
                {workspace.attentionPriority === undefined
                  ? "—"
                  : supervisionPriorityLabels[workspace.attentionPriority]}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {workspace.progressSummary ??
                  (workspace.lastActivityAt === undefined
                    ? "—"
                    : formatTimestamp(workspace.lastActivityAt))}
              </td>
              <td className="px-4 py-4 text-text-secondary">{workspace.primaryResult ?? "—"}</td>
              <td className="px-4 py-4 text-right">{renderAction?.(workspace)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
