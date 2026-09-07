import {
  schedulingStatusLabels,
  type SchedulingProcess,
} from "../model/appointment";

interface SchedulingPanelProps {
  scheduling: SchedulingProcess;
  formatDateTime: (timestamp: string, timezone?: string) => string;
  onSelectSlot?: (slotId: string) => void;
}

export function SchedulingPanel({
  scheduling,
  formatDateTime,
  onSelectSlot,
}: SchedulingPanelProps) {
  return (
    <section className="rounded-app-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">Planification</h3>
        <span className="text-sm font-medium text-text-secondary">
          {schedulingStatusLabels[scheduling.status]}
        </span>
      </div>

      {scheduling.availableSlots?.length ? (
        <ul className="mt-4 grid gap-2">
          {scheduling.availableSlots.map((slot) => {
            const isSelected = scheduling.selectedSlotId === slot.id;
            return (
              <li key={slot.id}>
                {onSelectSlot === undefined ? (
                  <p className={isSelected ? "rounded-app-md bg-surface-muted p-3 text-sm font-semibold text-text-primary" : "p-3 text-sm text-text-secondary"}>
                    {formatDateTime(slot.startsAt, slot.timezone)} – {formatDateTime(slot.endsAt, slot.timezone)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    aria-pressed={isSelected}
                    className={isSelected
                      ? "min-h-11 w-full rounded-app-md bg-brand-navy px-3 text-left text-sm font-semibold text-white"
                      : "min-h-11 w-full rounded-app-md border border-border-strong px-3 text-left text-sm text-text-secondary hover:bg-surface-muted"}
                  >
                    {formatDateTime(slot.startsAt, slot.timezone)} – {formatDateTime(slot.endsAt, slot.timezone)}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : scheduling.selectedSlot === undefined ? null : (
        <p className="mt-4 rounded-app-md bg-surface-muted p-3 text-sm font-semibold text-text-primary">
          {formatDateTime(scheduling.selectedSlot.startsAt, scheduling.selectedSlot.timezone)} –{" "}
          {formatDateTime(scheduling.selectedSlot.endsAt, scheduling.selectedSlot.timezone)}
        </p>
      )}
    </section>
  );
}
