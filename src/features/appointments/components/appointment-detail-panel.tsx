import {
  CommercialAssignmentCard,
  CommercialBriefView,
  type CommercialBrief,
} from "@/features/commercial-handoff";
import {
  appointmentOriginLabels,
  appointmentStatusLabels,
  crmSyncStatusLabels,
  type AppointmentListItem,
  type SchedulingProcess,
} from "../model/appointment";
import { AppointmentActions } from "./appointment-actions";
import { SchedulingPanel } from "./scheduling-panel";

interface AppointmentDetailPanelProps {
  item: AppointmentListItem;
  scheduling?: SchedulingProcess;
  brief?: CommercialBrief;
  formatDateTime: (timestamp: string, timezone?: string) => string;
  formatDuration: (minutes: number) => string;
  onViewProspect?: () => void;
  onViewConversation?: () => void;
  onViewBrief?: () => void;
  onAcknowledge?: () => void;
  onSelectSlot?: (slotId: string) => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function AppointmentDetailPanel({
  item,
  scheduling,
  brief,
  formatDateTime,
  formatDuration,
  onViewProspect,
  onViewConversation,
  onViewBrief,
  onAcknowledge,
  onSelectSlot,
  onReschedule,
  onCancel,
}: AppointmentDetailPanelProps) {
  const { appointment, prospect } = item;

  return (
    <div className="space-y-5">
      <article className="rounded-2xl border border-zinc-200 bg-white p-6">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <p className="text-sm font-medium text-zinc-600">
              {prospect.contact?.fullName ?? prospect.contact?.role ?? "Prospect"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">{prospect.company.name}</h2>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
            {appointmentStatusLabels[appointment.status]}
          </span>
        </header>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Date et heure</dt>
            <dd className="mt-1 font-medium text-zinc-950">
              {appointment.startsAt === undefined
                ? "À confirmer"
                : formatDateTime(appointment.startsAt, appointment.timezone)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Durée</dt>
            <dd className="mt-1 font-medium text-zinc-950">
              {appointment.durationMinutes === undefined
                ? "Inconnue"
                : formatDuration(appointment.durationMinutes)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Origine</dt>
            <dd className="mt-1 font-medium text-zinc-950">
              {appointmentOriginLabels[appointment.origin]}
            </dd>
          </div>
          {appointment.location?.label === undefined ? null : (
            <div>
              <dt className="text-zinc-500">Lieu ou canal</dt>
              <dd className="mt-1 font-medium text-zinc-950">{appointment.location.label}</dd>
            </div>
          )}
          {appointment.crmSyncStatus === undefined ? null : (
            <div>
              <dt className="text-zinc-500">Synchronisation CRM</dt>
              <dd className="mt-1 font-medium text-zinc-950">
                {crmSyncStatusLabels[appointment.crmSyncStatus]}
              </dd>
            </div>
          )}
        </dl>

        {appointment.participants.length === 0 ? null : (
          <section className="mt-5">
            <h3 className="text-sm font-semibold text-zinc-950">Participants</h3>
            <ul className="mt-2 space-y-1 text-sm text-zinc-700">
              {appointment.participants.map((participant, index) => (
                <li key={participant.id ?? participant.referenceId ?? `${participant.kind}-${index}`}>
                  {participant.displayName ?? participant.email ?? "Identité non disponible"}
                </li>
              ))}
            </ul>
          </section>
        )}

        {appointment.location?.videoUrl === undefined ? null : (
          <a
            href={appointment.location.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4"
          >
            Ouvrir le lien de visioconférence
          </a>
        )}

        {appointment.cancellation === undefined ? null : (
          <section className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">Annulation</h3>
            {appointment.cancellation.reasonLabel === undefined ? null : (
              <p className="mt-1 text-sm text-zinc-700">{appointment.cancellation.reasonLabel}</p>
            )}
            {appointment.cancellation.comment === undefined ? null : (
              <p className="mt-1 text-sm leading-6 text-zinc-600">{appointment.cancellation.comment}</p>
            )}
          </section>
        )}

        {appointment.reschedule === undefined ? null : (
          <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-950">Report demandé</h3>
            {appointment.reschedule.reason === undefined ? null : (
              <p className="mt-1 text-sm text-amber-900">{appointment.reschedule.reason}</p>
            )}
            {appointment.reschedule.previousStartAt === undefined ? null : (
              <p className="mt-1 text-sm text-amber-900">
                Créneau précédent : {formatDateTime(
                  appointment.reschedule.previousStartAt,
                  appointment.timezone,
                )}
              </p>
            )}
          </section>
        )}

        <div className="mt-6">
          <CommercialAssignmentCard
            assignment={appointment.assignment}
            {...(onAcknowledge === undefined ? {} : { onAcknowledge })}
          />
        </div>

        <div className="mt-5">
          <AppointmentActions
            {...(onViewProspect === undefined ? {} : { onViewProspect })}
            {...(onViewConversation === undefined ? {} : { onViewConversation })}
            {...(onViewBrief === undefined ? {} : { onViewBrief })}
            {...(onReschedule === undefined ? {} : { onReschedule })}
            {...(onCancel === undefined ? {} : { onCancel })}
          />
        </div>
      </article>

      {scheduling === undefined ? null : (
        <SchedulingPanel
          scheduling={scheduling}
          formatDateTime={formatDateTime}
          {...(onSelectSlot === undefined ? {} : { onSelectSlot })}
        />
      )}

      {brief === undefined ? null : (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <CommercialBriefView
            brief={brief}
            {...(onViewConversation === undefined ? {} : { onViewConversation })}
            {...(onAcknowledge === undefined ? {} : { onAcknowledge })}
          />
        </section>
      )}
    </div>
  );
}
