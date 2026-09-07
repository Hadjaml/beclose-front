import { commercialAssignmentStatusLabels } from "@/features/commercial-handoff";
import {
  appointmentOriginLabels,
  appointmentStatusLabels,
  type AppointmentListItem,
} from "../model/appointment";

interface AppointmentListProps {
  items: readonly AppointmentListItem[];
  activeAppointmentId: string | undefined;
  formatDateTime: (timestamp: string, timezone?: string) => string;
  onSelect: (appointmentId: string) => void;
}

export function AppointmentList({
  items,
  activeAppointmentId,
  formatDateTime,
  onSelect,
}: AppointmentListProps) {
  return (
    <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th className="px-4 py-3">Prospect / entreprise</th>
            <th className="px-4 py-3">Date et heure</th>
            <th className="px-4 py-3">Commercial</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Origine</th>
            <th className="px-4 py-3"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map(({ appointment, prospect }) => (
            <tr
              key={appointment.id}
              className={activeAppointmentId === appointment.id ? "bg-surface-muted" : ""}
            >
              <td className="px-4 py-4">
                <p className="font-semibold text-text-primary">
                  {prospect.contact?.fullName ?? prospect.company.name}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{prospect.company.name}</p>
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {appointment.startsAt === undefined
                  ? "Date à confirmer"
                  : formatDateTime(appointment.startsAt, appointment.timezone)}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {appointment.assignment.commercial?.displayName ??
                  commercialAssignmentStatusLabels[appointment.assignment.status]}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {appointmentStatusLabels[appointment.status]}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {appointmentOriginLabels[appointment.origin]}
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(appointment.id)}
                  className="min-h-10 rounded-app-md px-3 text-sm font-semibold text-text-primary hover:bg-surface-muted"
                >
                  Voir le détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
