import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import type {
  GlobalSupervision,
  RequiredAction,
  WorkspaceSupervisionSummary,
} from "../model/supervision";
import { ActivityList } from "./activity-list";
import { RequiredActionsList } from "./required-actions-list";
import { WorkspaceSupervisionList } from "./workspace-supervision-list";

type GlobalSupervisionViewProps =
  | { supervision: null }
  | {
      supervision: GlobalSupervision;
      formatTimestamp: (timestamp: string) => string;
      renderRequiredAction?: (action: RequiredAction) => ReactNode;
      renderWorkspaceAction?: (workspace: WorkspaceSupervisionSummary) => ReactNode;
    };

export function GlobalSupervisionView(props: GlobalSupervisionViewProps) {
  if (props.supervision === null) {
    return (
      <EmptyState
        title="Aucune donnée de supervision disponible"
        description="L’état des workspaces, les interventions requises et l’activité récente apparaîtront ici."
      />
    );
  }

  const workspaceNames = new Map(
    props.supervision.workspaces.map((workspace) => [
      workspace.workspaceId,
      workspace.workspaceName,
    ]),
  );
  const getWorkspaceName = (workspaceId: string) => workspaceNames.get(workspaceId);

  return (
    <div className="space-y-8">
      <section className="space-y-3" aria-labelledby="global-actions-title">
        <h2 id="global-actions-title" className="text-lg font-semibold text-text-primary">Interventions requises</h2>
        <RequiredActionsList
          actions={props.supervision.requiredActions}
          getWorkspaceName={getWorkspaceName}
          formatTimestamp={props.formatTimestamp}
          {...(props.renderRequiredAction === undefined
            ? {}
            : { renderAction: props.renderRequiredAction })}
        />
      </section>
      <section className="space-y-3" aria-labelledby="workspace-statuses-title">
        <h2 id="workspace-statuses-title" className="text-lg font-semibold text-text-primary">Workspaces</h2>
        <WorkspaceSupervisionList
          workspaces={props.supervision.workspaces}
          formatTimestamp={props.formatTimestamp}
          {...(props.renderWorkspaceAction === undefined
            ? {}
            : { renderAction: props.renderWorkspaceAction })}
        />
      </section>
      <section className="space-y-3" aria-labelledby="global-activity-title">
        <h2 id="global-activity-title" className="text-lg font-semibold text-text-primary">Activité récente</h2>
        <ActivityList
          events={props.supervision.recentActivity}
          getWorkspaceName={getWorkspaceName}
          formatTimestamp={props.formatTimestamp}
        />
      </section>
    </div>
  );
}
