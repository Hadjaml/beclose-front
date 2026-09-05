import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import type {
  RequiredAction,
  WorkspaceSupervision,
} from "../model/supervision";
import { ActivityList } from "./activity-list";
import { RequiredActionsList } from "./required-actions-list";
import { SystemStatusBadge } from "./system-status-badge";

type WorkspaceOverviewViewProps =
  | { supervision: null }
  | {
      supervision: WorkspaceSupervision;
      formatTimestamp: (timestamp: string) => string;
      renderRequiredAction?: (action: RequiredAction) => ReactNode;
      recommendationAction?: ReactNode;
    };

export function WorkspaceOverviewView(props: WorkspaceOverviewViewProps) {
  if (props.supervision === null) {
    return (
      <EmptyState
        title="Aucun état disponible pour le moment"
        description="L’état du système, les interventions et les résultats apparaîtront ici lorsqu’ils seront fournis."
      />
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-950">État du système</h2>
        <div className="mt-3"><SystemStatusBadge status={props.supervision.systemStatus} /></div>
        {props.supervision.statusReason === undefined ? null : (
          <p className="mt-3 text-sm leading-6 text-zinc-600">{props.supervision.statusReason}</p>
        )}
      </section>

      {props.supervision.nextRecommendation === undefined ? null : (
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Prochaine étape</p>
          <h2 className="mt-2 text-base font-semibold text-zinc-950">
            {props.supervision.nextRecommendation.title}
          </h2>
          {props.supervision.nextRecommendation.reason === undefined ? null : (
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {props.supervision.nextRecommendation.reason}
            </p>
          )}
          {props.recommendationAction === undefined ? null : (
            <div className="mt-4">{props.recommendationAction}</div>
          )}
        </section>
      )}

      <section className="space-y-3 xl:col-span-2" aria-labelledby="workspace-actions-title">
        <h2 id="workspace-actions-title" className="text-lg font-semibold text-zinc-950">
          Interventions en attente
        </h2>
        <RequiredActionsList
          actions={props.supervision.requiredActions}
          formatTimestamp={props.formatTimestamp}
          {...(props.renderRequiredAction === undefined
            ? {}
            : { renderAction: props.renderRequiredAction })}
        />
      </section>

      {props.supervision.resultSummaries?.length ? (
        <section className="space-y-3 xl:col-span-2" aria-labelledby="workspace-results-title">
          <h2 id="workspace-results-title" className="text-lg font-semibold text-zinc-950">
            Résultats synthétiques
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {props.supervision.resultSummaries.map((result) => (
              <div key={result.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                <dt className="text-sm text-zinc-600">{result.label}</dt>
                {result.formattedValue === undefined ? null : (
                  <dd className="mt-2 text-2xl font-semibold text-zinc-950">{result.formattedValue}</dd>
                )}
                {result.description === undefined ? null : (
                  <dd className="mt-2 text-sm leading-6 text-zinc-600">{result.description}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="space-y-3 xl:col-span-2" aria-labelledby="workspace-activity-title">
        <h2 id="workspace-activity-title" className="text-lg font-semibold text-zinc-950">
          Activité récente
        </h2>
        <ActivityList
          events={props.supervision.recentActivity}
          formatTimestamp={props.formatTimestamp}
        />
      </section>
    </div>
  );
}
