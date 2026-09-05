import type { PerformanceMetric } from "../model/performance";

interface PerformanceMetricCardProps {
  metric: PerformanceMetric;
}

export function PerformanceMetricCard({ metric }: PerformanceMetricCardProps) {
  const displayedValue =
    metric.formattedValue ??
    (metric.value === undefined ? "Non disponible" : String(metric.value));

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-600">{metric.label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{displayedValue}</p>
      {metric.comparison?.formattedChange === undefined ? null : (
        <p className="mt-2 text-sm text-zinc-600">{metric.comparison.formattedChange}</p>
      )}
      {metric.description === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-zinc-600">{metric.description}</p>
      )}
    </article>
  );
}
