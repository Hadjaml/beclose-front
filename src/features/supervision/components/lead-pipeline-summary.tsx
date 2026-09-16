import { EmptyState } from "@/shared/ui/states";
import {
  leadStatusDisplayOrder,
  leadStatusLabels,
  qualificationResultCountLabels,
  type QualificationResultCounts,
  type WorkspaceLeadPipeline,
} from "../model/lead-pipeline";

const qualificationResultDisplayOrder = [
  "qualified",
  "nurture",
  "not_qualified",
  "not_evaluated",
] as const satisfies readonly (keyof QualificationResultCounts)[];

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
    <section aria-labelledby="lead-pipeline-title" className="space-y-6">
      <div className="space-y-3">
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
      </div>

      {/* Complements the status counts above, doesn't replace them: a
          "replied" lead alone doesn't say whether it's qualified, still in
          nurture, or a dead end — this is where that becomes visible. */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Résultat de qualification</h3>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qualificationResultDisplayOrder.map((result) => (
            <div key={result} className="rounded-app-lg border border-border bg-surface p-4">
              <dt className="text-sm text-text-secondary">{qualificationResultCountLabels[result]}</dt>
              <dd className="mt-1 text-2xl font-semibold text-text-primary">
                {pipeline.qualificationResultCounts[result]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
