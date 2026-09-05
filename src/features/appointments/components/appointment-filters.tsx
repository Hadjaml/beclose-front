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
              ? "min-h-10 shrink-0 rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white"
              : "min-h-10 shrink-0 rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
