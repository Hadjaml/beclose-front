import type { ReactNode } from "react";
import {
  contactChannelLabels,
  exclusionTypeLabels,
  strategyValidationStatusLabels,
  targetingDecisionLabels,
  type Prospect,
} from "../model/prospecting";

interface ProspectDetailPanelProps {
  prospect: Prospect | null;
  onClose?: () => void;
  targetingActions?: ReactNode;
  strategyActions?: ReactNode;
  showScoringAnalysis?: boolean;
  showContactStrategy?: boolean;
  showHistory?: boolean;
}

function DetailList({
  title,
  values,
}: {
  title: string;
  values: readonly string[] | undefined;
}) {
  if (values === undefined || values.length === 0) {
    return null;
  }
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-text-secondary">
        {values.map((value) => <li key={value}>{value}</li>)}
      </ul>
    </section>
  );
}

export function ProspectDetailPanel({
  prospect,
  onClose,
  targetingActions,
  strategyActions,
  showScoringAnalysis = true,
  showContactStrategy = true,
  showHistory = true,
}: ProspectDetailPanelProps) {
  if (prospect === null) {
    return null;
  }

  const strategy = prospect.contactStrategy;

  return (
    <aside
      aria-labelledby="prospect-detail-title"
      className="w-full rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            {prospect.contact?.fullName ?? prospect.contact?.role ?? "Prospect"}
          </p>
          <h2 id="prospect-detail-title" className="mt-1 text-2xl font-semibold text-text-primary">
            {prospect.company.name}
          </h2>
        </div>
        {onClose === undefined ? null : (
          <button type="button" onClick={onClose} aria-label="Fermer le détail" className="rounded-app-md px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted">
            Fermer
          </button>
        )}
      </header>

      <div className="mt-6 grid gap-6">
        {prospect.alreadyKnown ? (
          <p className="rounded-app-md bg-amber-50 p-3 text-sm font-medium text-amber-900">Prospect déjà connu</p>
        ) : null}
        {prospect.priorExclusion === undefined ? null : (
          <section className="rounded-app-md border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-950">Exclusion antérieure</h3>
            <p className="mt-1 text-sm text-amber-900">
              {exclusionTypeLabels[prospect.priorExclusion.type]}
              {prospect.priorExclusion.reasonLabel === undefined ? "" : ` · ${prospect.priorExclusion.reasonLabel}`}
            </p>
            {prospect.priorExclusion.comment === undefined ? null : (
              <p className="mt-2 text-sm leading-6 text-amber-900">{prospect.priorExclusion.comment}</p>
            )}
          </section>
        )}

        <section>
          <h3 className="text-sm font-semibold text-text-primary">Informations principales</h3>
          <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Interlocuteur", prospect.contact?.fullName],
              ["Fonction", prospect.contact?.role],
              ["E-mail", prospect.contact?.email],
              ["Secteur", prospect.company.industry],
              ["Localisation", prospect.company.location],
              ["Taille", prospect.company.size],
            ].map(([label, value]) =>
              value === undefined ? null : (
                <div key={label}>
                  <dt className="text-text-tertiary">{label}</dt>
                  <dd className="mt-1 font-medium text-text-primary">{value}</dd>
                </div>
              ),
            )}
          </dl>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-text-primary">Recommandation de ciblage</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {prospect.recommendation === undefined
              ? "Aucune recommandation disponible."
              : targetingDecisionLabels[prospect.recommendation]}
          </p>
          {targetingActions === undefined ? null : <div className="mt-4">{targetingActions}</div>}
        </section>

        {!showScoringAnalysis || prospect.score === undefined ? null : (
          <section>
            <h3 className="text-sm font-semibold text-text-primary">Analyse du ciblage</h3>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{prospect.score.value}</p>
            {prospect.score.label === undefined ? null : (
              <p className="mt-1 text-sm text-text-secondary">{prospect.score.label}</p>
            )}
          </section>
        )}
        {showScoringAnalysis ? (
          <>
            <DetailList title="Raisons du score" values={prospect.score?.reasons} />
            <DetailList title="Critères correspondants" values={prospect.score?.matchedCriteria} />
            <DetailList title="Incertitudes à vérifier" values={prospect.score?.uncertainties} />
          </>
        ) : null}

        {!showContactStrategy || strategy === undefined ? null : (
          <section className="rounded-app-lg border border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-text-primary">Stratégie de contact</h3>
              <span className="text-sm font-medium text-text-secondary">
                {strategyValidationStatusLabels[strategy.validationStatus]}
              </span>
            </div>
            {strategy.recommendedChannel === undefined ? null : (
              <p className="mt-4 text-sm text-text-secondary">
                Canal recommandé : <strong>{contactChannelLabels[strategy.recommendedChannel]}</strong>
              </p>
            )}
            {strategy.channelOrder?.length ? (
              <p className="mt-2 text-sm text-text-secondary">
                Ordre proposé : {strategy.channelOrder.map((channel) => contactChannelLabels[channel]).join(" → ")}
              </p>
            ) : null}
            {strategy.angle === undefined ? null : <p className="mt-3 text-sm leading-6 text-text-secondary">{strategy.angle}</p>}
            {strategy.rationale === undefined ? null : <p className="mt-2 text-sm leading-6 text-text-secondary">{strategy.rationale}</p>}
            {strategyActions === undefined ? null : <div className="mt-4">{strategyActions}</div>}
          </section>
        )}

        {showHistory && prospect.history?.length ? (
          <section>
            <h3 className="text-sm font-semibold text-text-primary">Historique connu</h3>
            <ol className="mt-3 space-y-3">
              {prospect.history.map((entry) => (
                <li key={entry.id ?? `${entry.label}-${entry.occurredAt ?? ""}`} className="text-sm text-text-secondary">
                  <p className="font-medium text-text-primary">{entry.label}</p>
                  {entry.description === undefined ? null : <p className="mt-1 leading-6">{entry.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
