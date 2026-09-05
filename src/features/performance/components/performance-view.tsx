import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import type {
  PerformanceInsight,
  WorkspacePerformance,
} from "../model/performance";
import { PerformanceBreakdownTable } from "./performance-breakdown-table";
import { PerformanceFunnel } from "./performance-funnel";
import { PerformanceInsightCard } from "./performance-insight";
import { PerformanceMetricCard } from "./performance-metric-card";

type PerformanceViewProps =
  | { performance: null }
  | {
      performance: WorkspacePerformance;
      renderInsightAction?: (insight: PerformanceInsight) => ReactNode;
    };

export function PerformanceView(props: PerformanceViewProps) {
  if (props.performance === null) {
    return (
      <EmptyState
        title="Aucune donnée de performance disponible"
        description="Les résultats, comparaisons et recommandations apparaîtront ici lorsqu’ils seront fournis."
      />
    );
  }

  const hasContent =
    props.performance.metrics.length > 0 ||
    props.performance.funnel.length > 0 ||
    props.performance.breakdowns.length > 0 ||
    props.performance.insights.length > 0;

  if (!hasContent) {
    return (
      <EmptyState
        title="Aucune mesure disponible pour cette période"
        description="Les résultats apparaîtront lorsque le système disposera de données suffisantes."
      />
    );
  }

  return (
    <div className="space-y-9">
      {props.performance.period.label === undefined ? null : (
        <p className="text-sm font-medium text-zinc-600">{props.performance.period.label}</p>
      )}
      {props.performance.metrics.length === 0 ? null : (
        <section className="space-y-3" aria-labelledby="performance-metrics-title">
          <h2 id="performance-metrics-title" className="text-lg font-semibold text-zinc-950">Résultats</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {props.performance.metrics.map((metric) => (
              <PerformanceMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>
      )}
      {props.performance.funnel.length === 0 ? null : (
        <section className="space-y-3" aria-labelledby="performance-funnel-title">
          <div>
            <h2 id="performance-funnel-title" className="text-lg font-semibold text-zinc-950">
              Parcours de conversion
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Seules les étapes disposant de résultats sont affichées.
            </p>
          </div>
          <PerformanceFunnel stages={props.performance.funnel} />
        </section>
      )}
      {props.performance.breakdowns.map((breakdown) => (
        <PerformanceBreakdownTable key={breakdown.id} breakdown={breakdown} />
      ))}
      {props.performance.insights.length === 0 ? null : (
        <section className="space-y-3" aria-labelledby="performance-insights-title">
          <h2 id="performance-insights-title" className="text-lg font-semibold text-zinc-950">
            Observations et améliorations
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {props.performance.insights.map((insight) => (
              <PerformanceInsightCard
                key={insight.id}
                insight={insight}
                action={props.renderInsightAction?.(insight)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
