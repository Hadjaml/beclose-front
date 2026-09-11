import { EmptyState } from "@/shared/ui/states";
import {
  leadStatusDisplayOrder,
  leadStatusLabels,
  type WorkspaceLeadPipeline,
} from "../model/lead-pipeline";

export function LeadPipelineSummary({ pipeline }: { pipeline: WorkspaceLeadPipeline }) {
  if (pipeline.totalLeads === 0) {
    return (
      <EmptyState
        title="Aucun lead pour le moment"
        description="Les prospects identifiés par le sourcing apparaîtront ici."
      />
    );
  }

  return (
    <section aria-labelledby="lead-pipeline-title" className="space-y-3">
      <h2 id="lead-pipeline-title" className="text-lg font-semibold text-text-primary">
        Pipeline de prospection ({pipeline.totalLeads} lead{pipeline.totalLeads > 1 ? "s" : ""})
      </h2>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {leadStatusDisplayOrder.map((status) => (
          <div key={status} className="rounded-app-lg border border-border bg-surface p-4">
            <dt className="text-sm text-text-secondary">{leadStatusLabels[status]}</dt>
            <dd className="mt-1 text-2xl font-semibold text-text-primary">
              {pipeline.leadCounts[status]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
