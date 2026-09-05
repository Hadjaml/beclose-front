import type { ReactNode } from "react";
import {
  WorkspaceSupervisionList,
  type WorkspaceSupervisionSummary,
} from "@/features/supervision";
import { ClientsEmptyState } from "./clients-empty-state";

type ClientsSupervisionViewProps =
  | { workspaces: null }
  | {
      workspaces: readonly WorkspaceSupervisionSummary[];
      formatTimestamp: (timestamp: string) => string;
      renderAction?: (workspace: WorkspaceSupervisionSummary) => ReactNode;
    };

export function ClientsSupervisionView(props: ClientsSupervisionViewProps) {
  if (props.workspaces === null || props.workspaces.length === 0) {
    return <ClientsEmptyState />;
  }

  return (
    <WorkspaceSupervisionList
      workspaces={props.workspaces}
      formatTimestamp={props.formatTimestamp}
      {...(props.renderAction === undefined ? {} : { renderAction: props.renderAction })}
    />
  );
}
