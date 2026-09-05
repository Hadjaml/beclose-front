import {
  prospectStatusLabels,
  type ProspectStatus,
} from "../model/prospecting";

interface ProspectingToolbarProps {
  searchValue: string;
  status: ProspectStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (status: ProspectStatus | "") => void;
}

export function ProspectingToolbar({
  searchValue,
  status,
  onSearchChange,
  onStatusChange,
}: ProspectingToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row">
      <label className="flex-1">
        <span className="sr-only">Rechercher un prospect ou une entreprise</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un prospect ou une entreprise"
          className="min-h-11 w-full rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        />
      </label>
      <label>
        <span className="sr-only">Filtrer par statut</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ProspectStatus | "")}
          className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-800 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 sm:w-56"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(prospectStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
