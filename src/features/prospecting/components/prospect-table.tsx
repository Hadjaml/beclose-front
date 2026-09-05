"use client";

import {
  contactChannelLabels,
  prospectStatusLabels,
  targetingDecisionLabels,
  type Prospect,
} from "../model/prospecting";

interface ProspectTableProps {
  prospects: readonly Prospect[];
  selectedIds: ReadonlySet<string>;
  onSelectionChange: (selectedIds: ReadonlySet<string>) => void;
  onOpenProspect: (prospect: Prospect) => void;
  showSelection?: boolean;
  showScore?: boolean;
  showRecommendation?: boolean;
  showRecommendedChannel?: boolean;
}

export function ProspectTable({
  prospects,
  selectedIds,
  onSelectionChange,
  onOpenProspect,
  showSelection = true,
  showScore = true,
  showRecommendation = true,
  showRecommendedChannel = true,
}: ProspectTableProps) {
  const allSelected = prospects.length > 0 && prospects.every(({ id }) => selectedIds.has(id));

  function toggleAll() {
    onSelectionChange(allSelected ? new Set() : new Set(prospects.map(({ id }) => id)));
  }

  function toggleProspect(id: string) {
    const nextSelection = new Set(selectedIds);
    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }
    onSelectionChange(nextSelection);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          <tr>
            {showSelection ? <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Sélectionner tous les prospects"
                className="size-4 rounded border-zinc-300"
              />
            </th> : null}
            <th className="px-4 py-3">Prospect / entreprise</th>
            <th className="px-4 py-3">Interlocuteur</th>
            {showScore ? <th className="px-4 py-3">Score</th> : null}
            {showRecommendation ? <th className="px-4 py-3">Recommandation</th> : null}
            {showRecommendedChannel ? <th className="px-4 py-3">Canal</th> : null}
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {prospects.map((prospect) => (
            <tr key={prospect.id} className="text-zinc-700 hover:bg-zinc-50">
              {showSelection ? <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(prospect.id)}
                  onChange={() => toggleProspect(prospect.id)}
                  aria-label={`Sélectionner ${prospect.company.name}`}
                  className="size-4 rounded border-zinc-300"
                />
              </td> : null}
              <td className="px-4 py-4">
                <button
                  type="button"
                  onClick={() => onOpenProspect(prospect)}
                  className="font-semibold text-zinc-950 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                >
                  {prospect.company.name}
                </button>
              </td>
              <td className="px-4 py-4">{prospect.contact?.fullName ?? "—"}</td>
              {showScore ? <td className="px-4 py-4">{prospect.score?.value ?? "—"}</td> : null}
              {showRecommendation ? <td className="px-4 py-4">
                {prospect.recommendation === undefined
                  ? "—"
                  : targetingDecisionLabels[prospect.recommendation]}
              </td> : null}
              {showRecommendedChannel ? <td className="px-4 py-4">
                {prospect.contactStrategy?.recommendedChannel === undefined
                  ? "—"
                  : contactChannelLabels[prospect.contactStrategy.recommendedChannel]}
              </td> : null}
              <td className="px-4 py-4">{prospectStatusLabels[prospect.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
