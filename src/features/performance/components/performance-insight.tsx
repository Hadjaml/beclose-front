import type { ReactNode } from "react";
import type { PerformanceInsight as PerformanceInsightData } from "../model/performance";

interface PerformanceInsightProps {
  insight: PerformanceInsightData;
  action?: ReactNode;
}

export function PerformanceInsightCard({
  insight,
  action,
}: PerformanceInsightProps) {
  return (
    <article className="rounded-app-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-6 text-text-primary">{insight.observation}</h3>
        {insight.formattedConfidence === undefined ? null : (
          <span className="text-xs font-medium text-text-tertiary">
            Confiance {insight.formattedConfidence}
          </span>
        )}
      </div>
      {insight.impact === undefined ? null : (
        <p className="mt-3 text-sm leading-6 text-text-secondary">{insight.impact}</p>
      )}
      {insight.recommendation === undefined ? null : (
        <section className="mt-4 rounded-app-md bg-brand-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Recommandation</p>
          <p className="mt-2 text-sm leading-6 text-text-primary">{insight.recommendation}</p>
        </section>
      )}
      {action === undefined ? null : <div className="mt-4">{action}</div>}
    </article>
  );
}
