"use client";

interface AppointmentActionsProps {
  onViewProspect?: () => void;
  onViewConversation?: () => void;
  onViewBrief?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function AppointmentActions({
  onViewProspect,
  onViewConversation,
  onViewBrief,
  onReschedule,
  onCancel,
}: AppointmentActionsProps) {
  const actions = [
    ["Voir le prospect", onViewProspect],
    ["Voir la conversation", onViewConversation],
    ["Voir le brief", onViewBrief],
    ["Replanifier", onReschedule],
    ["Annuler", onCancel],
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([label, callback]) =>
        callback === undefined ? null : (
          <button
            key={label}
            type="button"
            onClick={callback}
            className="min-h-10 rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}
