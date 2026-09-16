import Link from "next/link";
import {
  handoffReasonKind,
  handoffReasonLabels,
  leadStatusLabels,
  qualificationResultLabels,
  type LeadProspect,
} from "../model/lead-prospect";
import { ProspectingEmptyState } from "./prospecting-empty-state";
import type { WorkspaceId } from "@/shared/workspace/workspace";

const resultBadgeClasses = {
  qualified: "bg-emerald-50 text-emerald-700",
  nurture: "bg-amber-50 text-amber-700",
  not_qualified: "bg-surface-muted text-text-tertiary",
} as const;

export function LeadProspectsList({
  prospects,
  workspaceId,
}: {
  prospects: readonly LeadProspect[];
  workspaceId: WorkspaceId;
}) {
  if (prospects.length === 0) {
    return <ProspectingEmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
          <tr>
            <th className="px-4 py-3 font-semibold">Entreprise</th>
            <th className="px-4 py-3 font-semibold">Contact</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Qualification</th>
            <th className="px-4 py-3 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {prospects.map((prospect) => (
            <tr key={prospect.leadId} className="hover:bg-surface-muted">
              <td className="px-4 py-3">
                <Link
                  href={`/backoffice/workspaces/${workspaceId}/prospecting/${prospect.leadId}`}
                  className="font-medium text-brand-blue-violet hover:underline"
                >
                  {prospect.company.name}
                </Link>
                {prospect.company.sector === null ? null : (
                  <p className="text-text-tertiary">{prospect.company.sector}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="text-text-primary">{prospect.contact.fullName ?? prospect.contact.email}</p>
                {prospect.contact.role === null ? null : (
                  <p className="text-text-tertiary">{prospect.contact.role}</p>
                )}
              </td>
              <td className="px-4 py-3 text-text-primary">
                {leadStatusLabels[prospect.status]}
                {prospect.status === "handed_off" && prospect.handoffReason !== null ? (
                  <p
                    className={
                      handoffReasonKind[prospect.handoffReason] === "success"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }
                  >
                    {handoffReasonLabels[prospect.handoffReason]}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3">
                {prospect.qualificationResult === null ? (
                  <span className="text-text-tertiary">Non évalué</span>
                ) : (
                  <span
                    className={`inline-flex rounded-app-sm px-2 py-1 text-xs font-semibold ${resultBadgeClasses[prospect.qualificationResult]}`}
                  >
                    {qualificationResultLabels[prospect.qualificationResult]}
                  </span>
                )}
                {prospect.qualificationResult === "nurture" && prospect.nurtureFollowUpsSent > 0 ? (
                  <p className="mt-1 text-text-tertiary">
                    {prospect.nurtureFollowUpsSent} relance
                    {prospect.nurtureFollowUpsSent > 1 ? "s" : ""} envoyée
                    {prospect.nurtureFollowUpsSent > 1 ? "s" : ""}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-text-tertiary">{prospect.company.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
