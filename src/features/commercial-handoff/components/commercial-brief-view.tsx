import { contactChannelLabels, targetingDecisionLabels } from "@/features/prospecting";
import { QualificationPanel } from "@/features/conversations";
import type { CommercialBrief } from "../model/commercial-handoff";
import { CommercialAssignmentCard } from "./commercial-assignment-card";

interface BriefSectionProps {
  title: string;
  children?: React.ReactNode;
}

function BriefSection({ title, children }: BriefSectionProps) {
  return (
    <section className="rounded-app-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {children === undefined ? (
        <p className="mt-2 text-sm text-text-tertiary">Information non disponible.</p>
      ) : (
        <div className="mt-3 text-sm leading-6 text-text-secondary">{children}</div>
      )}
    </section>
  );
}

function TextItems({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

interface CommercialBriefViewProps {
  brief: CommercialBrief;
  onViewConversation?: () => void;
  onAcknowledge?: () => void;
}

export function CommercialBriefView({
  brief,
  onViewConversation,
  onAcknowledge,
}: CommercialBriefViewProps) {
  const identity = brief.identitySnapshot;
  const targeting = brief.targetingSnapshot;
  const history = brief.historySnapshot;
  const need = brief.needSnapshot;
  const reservations = brief.reservationsSnapshot;
  const discovery = brief.discoverySnapshot;
  const angle = brief.commercialAngle;

  return (
    <article aria-labelledby="commercial-brief-title" className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-tertiary">Préparation commerciale</p>
          <h2 id="commercial-brief-title" className="mt-1 text-2xl font-semibold text-text-primary">
            Brief du rendez-vous
          </h2>
        </div>
        {onViewConversation === undefined ? null : (
          <button
            type="button"
            onClick={onViewConversation}
            className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
          >
            Voir la conversation
          </button>
        )}
      </header>

      <CommercialAssignmentCard
        assignment={brief.nextStep.assignment}
        {...(onAcknowledge === undefined ? {} : { onAcknowledge })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <BriefSection title="Qui est cette personne ?">
          {identity === undefined ? undefined : (
            <div className="space-y-1">
              <p className="font-semibold text-text-primary">{identity.company.name}</p>
              {identity.contact?.fullName === undefined ? null : <p>{identity.contact.fullName}</p>}
              {identity.contact?.role === undefined ? null : <p>{identity.contact.role}</p>}
              {identity.usefulInformation?.length ? <TextItems items={identity.usefulInformation} /> : null}
            </div>
          )}
        </BriefSection>

        <BriefSection title="Pourquoi ce prospect ?">
          {targeting === undefined ? undefined : (
            <div className="space-y-2">
              {targeting.initialReason === undefined ? null : <p>{targeting.initialReason}</p>}
              {targeting.recommendation === undefined ? null : (
                <p>Recommandation : {targetingDecisionLabels[targeting.recommendation]}</p>
              )}
              {targeting.score === undefined ? null : <p>Score : {targeting.score.value}</p>}
              {targeting.matchedIcpCriteria?.length ? <TextItems items={targeting.matchedIcpCriteria} /> : null}
            </div>
          )}
        </BriefSection>

        <BriefSection title="Ce que l’on sait déjà">
          {history === undefined && need === undefined ? undefined : (
            <div className="space-y-2">
              {need?.problemOrNeed === undefined ? null : <p>{need.problemOrNeed}</p>}
              {need?.expressedInterest === undefined ? null : <p>{need.expressedInterest}</p>}
              {need?.context === undefined ? null : <p>{need.context}</p>}
              {history?.outreachSummary === undefined ? null : <p>{history.outreachSummary}</p>}
              {history?.conversationSummary === undefined ? null : <p>{history.conversationSummary}</p>}
              {history?.channelsUsed?.length ? (
                <p>Canaux : {history.channelsUsed.map((channel) => contactChannelLabels[channel]).join(", ")}</p>
              ) : null}
            </div>
          )}
        </BriefSection>

        <BriefSection title="Objections et réserves">
          {reservations === undefined ? undefined : (
            <div className="space-y-3">
              {reservations.objections?.length ? <TextItems items={reservations.objections} /> : null}
              {reservations.unresolvedQuestions?.length ? <TextItems items={reservations.unresolvedQuestions} /> : null}
              {reservations.blockers?.length ? <TextItems items={reservations.blockers} /> : null}
            </div>
          )}
        </BriefSection>

        <BriefSection title="Ce qu’il reste à découvrir">
          {discovery === undefined ? undefined : (
            <div className="space-y-3">
              {discovery.missingInformation?.length ? <TextItems items={discovery.missingInformation} /> : null}
              {discovery.suggestedQuestions?.length ? <TextItems items={discovery.suggestedQuestions} /> : null}
            </div>
          )}
        </BriefSection>

        <BriefSection title="Angle commercial">
          {angle === undefined ? undefined : (
            <div className="space-y-2">
              {angle.angle === undefined ? null : <p className="font-medium text-text-primary">{angle.angle}</p>}
              {angle.rationale === undefined ? null : <p>{angle.rationale}</p>}
            </div>
          )}
        </BriefSection>
      </div>

      {brief.qualificationSnapshot === undefined ? (
        <BriefSection title="Qualification" />
      ) : (
        <section className="rounded-app-lg border border-border bg-surface p-5">
          <QualificationPanel qualification={brief.qualificationSnapshot} />
        </section>
      )}

      <BriefSection title="Objectif du rendez-vous">
        {brief.nextStep.objective === undefined ? undefined : <p>{brief.nextStep.objective}</p>}
      </BriefSection>
    </article>
  );
}
