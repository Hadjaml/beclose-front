export type ConversationFilter =
  | "ALL"
  | "AGENT_ACTIVE"
  | "MONITORING"
  | "INTERVENTION_REQUIRED"
  | "HUMAN";

const filters = [
  ["ALL", "Toutes"],
  ["AGENT_ACTIVE", "Agent en cours"],
  ["MONITORING", "À surveiller"],
  ["INTERVENTION_REQUIRED", "Intervention requise"],
  ["HUMAN", "Humain"],
] as const satisfies readonly (readonly [ConversationFilter, string])[];

interface ConversationFiltersProps {
  value: ConversationFilter;
  onChange: (filter: ConversationFilter) => void;
}

export function ConversationFilters({ value, onChange }: ConversationFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Vues de la boîte de réception">
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
