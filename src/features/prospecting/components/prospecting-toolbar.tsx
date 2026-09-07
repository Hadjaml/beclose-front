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
    <div className="flex flex-col gap-3 rounded-app-lg border border-border bg-surface p-4 sm:flex-row">
      <label className="flex-1">
        <span className="sr-only">Rechercher un prospect ou une entreprise</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un prospect ou une entreprise"
          className="min-h-11 w-full rounded-app-md border border-border-strong px-3.5 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
        />
      </label>
      <label>
        <span className="sr-only">Filtrer par statut</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ProspectStatus | "")}
          className="min-h-11 w-full rounded-app-md border border-border-strong bg-surface px-3.5 text-sm text-text-primary outline-none focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15 sm:w-56"
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
