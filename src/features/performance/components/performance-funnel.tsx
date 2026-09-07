import type { FunnelStage } from "../model/performance";

interface PerformanceFunnelProps {
  stages: readonly FunnelStage[];
}

export function PerformanceFunnel({ stages }: PerformanceFunnelProps) {
  if (stages.length === 0) {
    return null;
  }

  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stages.map((stage, index) => (
        <li key={stage.stage} className="rounded-app-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Étape {index + 1}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">{stage.label}</h3>
          <p className="mt-3 text-2xl font-semibold text-text-primary">
            {stage.metric.formattedValue ??
              (stage.metric.value === undefined ? "Non disponible" : String(stage.metric.value))}
          </p>
        </li>
      ))}
    </ol>
  );
}
