export type AppointmentFilter = "UPCOMING" | "PENDING" | "PAST" | "CANCELED";

const filters = [
  ["UPCOMING", "À venir"],
  ["PENDING", "À confirmer"],
  ["PAST", "Passés"],
  ["CANCELED", "Annulés"],
] as const satisfies readonly (readonly [AppointmentFilter, string])[];

interface AppointmentFiltersProps {
  value: AppointmentFilter;
  onChange: (filter: AppointmentFilter) => void;
}

export function AppointmentFilters({ value, onChange }: AppointmentFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Vues des rendez-vous">
      {filters.map(([filter, label]) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          aria-pressed={value === filter}
          className={
            value === filter
              ? "min-h-10 shrink-0 rounded-full bg-brand-navy px-4 text-sm font-semibold text-white"
              : "min-h-10 shrink-0 rounded-full border border-border-strong bg-surface px-4 text-sm font-medium text-text-secondary hover:bg-surface-muted"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
