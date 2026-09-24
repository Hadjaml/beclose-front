"use client";

import Link from "next/link";
import { ApiError } from "@/shared/api/api-error";
import { formatDateTime } from "@/shared/format/format-date-time";
import { EmptyState, ErrorState, LoadingState, NotAvailableState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import { useWorkspaceAppointmentsQuery } from "../api/use-workspace-appointments-query";
import {
  safeCalendarUrl,
  workspaceAppointmentStatusLabel,
  type WorkspaceAppointment,
} from "../model/workspace-appointment";

export function WorkspaceAppointmentsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <WorkspaceAppointments workspaceId={activeWorkspaceId} />;
}

function WorkspaceAppointments({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceAppointmentsQuery(workspaceId);

  if (query.isPending) return <LoadingState label="Chargement des rendez-vous…" />;
  if (query.isError) {
    // A server that does not offer the endpoint yet: say so, not "error".
    if (query.error instanceof ApiError && query.error.status === 404) {
      return (
        <NotAvailableState description="Ce serveur ne propose pas encore la lecture des rendez-vous : un rendez-vous confirmé peut exister sans apparaître ici." />
      );
    }
    return (
      <ErrorState title="Impossible de charger les rendez-vous" onRetry={() => void query.refetch()} />
    );
  }

  const { data: appointments, pagination } = query.data;
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="Aucun rendez-vous confirmé"
        description="Les rendez-vous confirmés avec les prospects de ce client apparaissent ici."
      />
    );
  }

  return (
    <div className="space-y-3">
      {pagination.total > appointments.length ? (
        <p className="text-sm text-text-secondary">
          {appointments.length} sur {pagination.total} rendez-vous affichés (les plus récents).
        </p>
      ) : null}
      <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
        {appointments.map((appointment) => (
          <AppointmentRow key={appointment.id} appointment={appointment} workspaceId={workspaceId} />
        ))}
      </ul>
    </div>
  );
}

function AppointmentRow({
  appointment,
  workspaceId,
}: {
  appointment: WorkspaceAppointment;
  workspaceId: WorkspaceId;
}) {
  const calendarUrl = safeCalendarUrl(appointment.eventUrl);
  const contactName = appointment.contact.fullName ?? appointment.contact.email;

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{formatDateTime(appointment.scheduledAt)}</p>
        <Link
          href={`/backoffice/workspaces/${workspaceId}/prospecting/${appointment.leadId}`}
          className="text-sm font-medium text-brand-blue-violet hover:underline"
        >
          {appointment.company.name}
        </Link>
        <p className="text-sm text-text-secondary">
          {contactName}
          {appointment.contact.role === null ? "" : ` · ${appointment.contact.role}`}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 text-sm">
        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-text-primary">
          {workspaceAppointmentStatusLabel(appointment.status)}
        </span>
        {calendarUrl === null ? (
          <span className="text-xs text-text-tertiary">Lien Google Agenda indisponible</span>
        ) : (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-blue-violet hover:underline"
          >
            Ouvrir dans Google Agenda
          </a>
        )}
      </div>
    </li>
  );
}
