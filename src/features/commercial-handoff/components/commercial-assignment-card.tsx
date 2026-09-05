"use client";

import {
  commercialAssignmentStatusLabels,
  type CommercialAssignment,
} from "../model/commercial-handoff";

interface CommercialAssignmentCardProps {
  assignment: CommercialAssignment;
  onAcknowledge?: () => void;
}

export function CommercialAssignmentCard({
  assignment,
  onAcknowledge,
}: CommercialAssignmentCardProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Passage au commercial
          </p>
          <h3 className="mt-2 text-sm font-semibold text-zinc-950">
            {commercialAssignmentStatusLabels[assignment.status]}
          </h3>
          {assignment.commercial?.displayName === undefined ? null : (
            <p className="mt-1 text-sm text-zinc-700">{assignment.commercial.displayName}</p>
          )}
          {assignment.commercial?.teamName === undefined ? null : (
            <p className="mt-1 text-sm text-zinc-600">{assignment.commercial.teamName}</p>
          )}
        </div>
        {assignment.status === "ASSIGNED" && onAcknowledge !== undefined ? (
          <button
            type="button"
            onClick={onAcknowledge}
            className="min-h-10 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Prendre en charge
          </button>
        ) : null}
      </div>
    </section>
  );
}
