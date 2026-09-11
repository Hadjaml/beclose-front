import { leadStatusLabels } from "../model/lead-prospect";
import type { LeadProspect } from "../model/lead-prospect";
import { ProspectingEmptyState } from "./prospecting-empty-state";

export function LeadProspectsList({ prospects }: { prospects: readonly LeadProspect[] }) {
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
            <th className="px-4 py-3 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {prospects.map((prospect) => (
            <tr key={prospect.leadId}>
              <td className="px-4 py-3">
                <p className="font-medium text-text-primary">{prospect.company.name}</p>
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
              <td className="px-4 py-3 text-text-primary">{leadStatusLabels[prospect.status]}</td>
              <td className="px-4 py-3 text-text-tertiary">{prospect.company.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
