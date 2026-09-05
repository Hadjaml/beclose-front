import { contactChannelLabels } from "@/features/prospecting";
import {
  contactAttemptKindLabels,
  messageDeliveryStatusLabels,
  outreachSequenceStatusLabels,
  type OutreachSequence,
} from "../model/outreach";

interface OutreachSequenceTimelineProps {
  sequence: OutreachSequence;
  formatTimestamp: (timestamp: string) => string;
  formatDuration: (seconds: number) => string;
}

export function OutreachSequenceTimeline({
  sequence,
  formatTimestamp,
  formatDuration,
}: OutreachSequenceTimelineProps) {
  return (
    <section aria-labelledby="outreach-sequence-title" className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="outreach-sequence-title" className="text-base font-semibold text-zinc-950">
          Prises de contact
        </h2>
        <span className="text-sm font-medium text-zinc-600">
          {outreachSequenceStatusLabels[sequence.status]}
        </span>
      </div>

      {sequence.attempts.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600">Aucune tentative enregistrée.</p>
      ) : (
        <ol className="mt-5 space-y-4 border-l border-zinc-200 pl-5">
          {sequence.attempts.map((attempt) => (
            <li key={attempt.id} className="relative">
              <span aria-hidden className="absolute -left-[1.55rem] top-1.5 size-2 rounded-full bg-zinc-400" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-sm font-semibold text-zinc-950">
                  {contactAttemptKindLabels[attempt.kind]}
                </h3>
                <span className="text-sm text-zinc-500">
                  {contactChannelLabels[attempt.channel]}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-700">
                {messageDeliveryStatusLabels[attempt.deliveryStatus]}
              </p>
              {attempt.sentAt === undefined ? null : (
                <time dateTime={attempt.sentAt} className="mt-1 block text-sm text-zinc-500">
                  {formatTimestamp(attempt.sentAt)}
                </time>
              )}
              {attempt.delayBeforeNextAttemptSeconds === undefined ? null : (
                <p className="mt-2 text-sm text-zinc-600">
                  Délai prévu avant la suite : {formatDuration(attempt.delayBeforeNextAttemptSeconds)}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {sequence.nextAction === undefined ? null : (
        <section className="mt-5 rounded-lg bg-zinc-50 p-4">
          <h3 className="text-sm font-semibold text-zinc-950">Prochaine action prévue</h3>
          {sequence.nextAction.reason === undefined ? null : (
            <p className="mt-1 text-sm leading-6 text-zinc-600">{sequence.nextAction.reason}</p>
          )}
          {sequence.nextAction.scheduledAt === undefined ? null : (
            <time dateTime={sequence.nextAction.scheduledAt} className="mt-2 block text-sm text-zinc-600">
              {formatTimestamp(sequence.nextAction.scheduledAt)}
            </time>
          )}
        </section>
      )}

      {sequence.stopReason === undefined ? null : (
        <section className="mt-5 border-t border-zinc-100 pt-4">
          <h3 className="text-sm font-semibold text-zinc-950">Séquence arrêtée</h3>
          {sequence.stopReason.label === undefined ? null : (
            <p className="mt-1 text-sm text-zinc-700">{sequence.stopReason.label}</p>
          )}
          {sequence.stopReason.detail === undefined ? null : (
            <p className="mt-1 text-sm leading-6 text-zinc-600">{sequence.stopReason.detail}</p>
          )}
        </section>
      )}
    </section>
  );
}
