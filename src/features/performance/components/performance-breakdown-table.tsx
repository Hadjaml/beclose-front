import type { PerformanceBreakdown } from "../model/performance";

interface PerformanceBreakdownTableProps {
  breakdown: PerformanceBreakdown;
}

export function PerformanceBreakdownTable({
  breakdown,
}: PerformanceBreakdownTableProps) {
  const metricColumns = breakdown.rows[0]?.metrics ?? [];

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-950">{breakdown.label}</h3>
      {breakdown.rows.length === 0 ? null : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Dimension</th>
                {metricColumns.map((metric) => (
                  <th key={metric.id} className="px-4 py-3">{metric.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {breakdown.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className="px-4 py-4 font-semibold text-zinc-950">{row.label}</th>
                  {metricColumns.map((column) => {
                    const metric = row.metrics.find(({ id }) => id === column.id);
                    return (
                      <td key={column.id} className="px-4 py-4 text-zinc-700">
                        {metric?.formattedValue ??
                          (metric?.value === undefined ? "—" : String(metric.value))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
