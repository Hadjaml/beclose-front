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
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          <tr>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">État</th>
            <th className="px-4 py-3">Attention</th>
            <th className="px-4 py-3">Progression / activité</th>
            <th className="px-4 py-3">Résultat principal</th>
            <th className="px-4 py-3"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {workspaces.map((workspace) => (
            <tr key={workspace.workspaceId}>
              <td className="px-4 py-4 font-semibold text-zinc-950">{workspace.workspaceName}</td>
              <td className="px-4 py-4"><SystemStatusBadge status={workspace.systemStatus} /></td>
              <td className="px-4 py-4 text-zinc-700">
                {workspace.attentionPriority === undefined
                  ? "—"
                  : supervisionPriorityLabels[workspace.attentionPriority]}
              </td>
              <td className="px-4 py-4 text-zinc-700">
                {workspace.progressSummary ??
                  (workspace.lastActivityAt === undefined
                    ? "—"
                    : formatTimestamp(workspace.lastActivityAt))}
              </td>
              <td className="px-4 py-4 text-zinc-700">{workspace.primaryResult ?? "—"}</td>
              <td className="px-4 py-4 text-right">{renderAction?.(workspace)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
