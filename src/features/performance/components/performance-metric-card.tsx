import type { PerformanceMetric } from "../model/performance";

interface PerformanceMetricCardProps {
  metric: PerformanceMetric;
}

export function PerformanceMetricCard({ metric }: PerformanceMetricCardProps) {
  const displayedValue =
    metric.formattedValue ??
    (metric.value === undefined ? "Non disponible" : String(metric.value));

  return (
    <article className="rounded-app-lg border border-border bg-surface p-5">
      <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{displayedValue}</p>
      {metric.comparison?.formattedChange === undefined ? null : (
        <p className="mt-2 text-sm text-text-secondary">{metric.comparison.formattedChange}</p>
      )}
      {metric.description === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-text-secondary">{metric.description}</p>
      )}
    </article>
  );
}
