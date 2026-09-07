import type { ReactNode } from "react";
import {
  autonomyStateLabels,
  learningDomainLabels,
  type LearningDomainSnapshot,
} from "../model/learning";

interface LearningDomainCardProps {
  snapshot: LearningDomainSnapshot;
  historyAction?: ReactNode;
}

export function LearningDomainCard({ snapshot, historyAction }: LearningDomainCardProps) {
  const facts = [
    ["Validations observées", snapshot.observedValidations],
    ["Confirmations", snapshot.confirmations],
    ["Corrections", snapshot.corrections],
  ] as const;

  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">
          {learningDomainLabels[snapshot.domain]}
        </h2>
        <span className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-text-secondary">
          {autonomyStateLabels[snapshot.autonomyState]}
        </span>
      </div>

      {facts.some(([, value]) => value !== undefined) ? (
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {facts.map(([label, value]) =>
            value === undefined ? null : (
              <div key={label}>
                <dt className="text-sm text-text-secondary">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-text-primary">{value}</dd>
              </div>
            ),
          )}
        </dl>
      ) : null}

      {snapshot.insights?.length ? (
        <section className="mt-6" aria-label="Enseignements identifiés">
          <h3 className="text-sm font-semibold text-text-primary">Enseignements identifiés</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-text-secondary">
            {snapshot.insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {snapshot.proposedRules?.length ? (
        <section className="mt-6" aria-label="Règles proposées">
          <h3 className="text-sm font-semibold text-text-primary">Règles à confirmer</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-text-secondary">
            {snapshot.proposedRules.map((rule) => (
              <li key={rule.id ?? rule.statement}>{rule.statement}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {snapshot.validationHistoryAvailable && historyAction ? (
        <div className="mt-6 border-t border-border pt-5">{historyAction}</div>
      ) : null}
    </article>
  );
}
