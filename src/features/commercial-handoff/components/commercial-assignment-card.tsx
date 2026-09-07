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
    <section className="rounded-app-md border border-border bg-surface-muted p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Passage au commercial
          </p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">
            {commercialAssignmentStatusLabels[assignment.status]}
          </h3>
          {assignment.commercial?.displayName === undefined ? null : (
            <p className="mt-1 text-sm text-text-secondary">{assignment.commercial.displayName}</p>
          )}
          {assignment.commercial?.teamName === undefined ? null : (
            <p className="mt-1 text-sm text-text-secondary">{assignment.commercial.teamName}</p>
          )}
        </div>
        {assignment.status === "ASSIGNED" && onAcknowledge !== undefined ? (
          <button
            type="button"
            onClick={onAcknowledge}
            className="min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-brand-navy-hover"
          >
            Prendre en charge
          </button>
        ) : null}
      </div>
    </section>
  );
}
