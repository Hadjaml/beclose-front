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
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-950">Planification</h3>
        <span className="text-sm font-medium text-zinc-600">
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
                  <p className={isSelected ? "rounded-lg bg-zinc-100 p-3 text-sm font-semibold text-zinc-950" : "p-3 text-sm text-zinc-700"}>
                    {formatDateTime(slot.startsAt, slot.timezone)} – {formatDateTime(slot.endsAt, slot.timezone)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    aria-pressed={isSelected}
                    className={isSelected
                      ? "min-h-11 w-full rounded-lg bg-zinc-950 px-3 text-left text-sm font-semibold text-white"
                      : "min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50"}
                  >
                    {formatDateTime(slot.startsAt, slot.timezone)} – {formatDateTime(slot.endsAt, slot.timezone)}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : scheduling.selectedSlot === undefined ? null : (
        <p className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm font-semibold text-zinc-950">
          {formatDateTime(scheduling.selectedSlot.startsAt, scheduling.selectedSlot.timezone)} –{" "}
          {formatDateTime(scheduling.selectedSlot.endsAt, scheduling.selectedSlot.timezone)}
        </p>
      )}
    </section>
  );
}
