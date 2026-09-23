import type { ReactNode } from "react";
import type { BantCriteriaWire } from "../schemas/bant-criteria-wire-schema";

/** Structured rendering of the real BANT grid (`qualification_criteria.criteria`,
 * `bantCriteriaWireSchema`) — replaces the raw JSON dump. Presentation only,
 * no business rules: every label here is just naming a field the backend
 * already produced. */

function StringList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-text-tertiary">{emptyLabel}</p>;
  }
  return (
    <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function CriterionCard({
  title,
  definition,
  statusValues,
  children,
}: {
  title: string;
  definition: string;
  statusValues: string[];
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-app-lg border border-border bg-surface p-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{definition}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {statusValues.map((value) => (
          <span
            key={value}
            className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-secondary"
          >
            {value}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

export function BantCriteriaView({ criteria }: { criteria: BantCriteriaWire }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <CriterionCard title="Budget" definition={criteria.budget.definition} statusValues={criteria.budget.statusValues}>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-tertiary">Signaux positifs</dt>
            <dd><StringList items={criteria.budget.positiveSignals} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Signaux négatifs</dt>
            <dd><StringList items={criteria.budget.negativeSignals} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Montant explicite requis</dt>
            <dd>{criteria.budget.explicitAmountRequired ? "Oui" : "Non"}</dd>
          </dl>
        </CriterionCard>

        <CriterionCard
          title="Authority"
          definition={criteria.authority.definition}
          statusValues={criteria.authority.statusValues}
        >
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-tertiary">Titres décideurs</dt>
            <dd><StringList items={criteria.authority.decisionMakerTitles} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Titres relais (champions)</dt>
            <dd><StringList items={criteria.authority.championTitles} emptyLabel="Aucun" /></dd>
          </dl>
        </CriterionCard>

        <CriterionCard title="Need" definition={criteria.need.definition} statusValues={criteria.need.statusValues}>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-tertiary">Signaux forts</dt>
            <dd><StringList items={criteria.need.strongSignals} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Signaux modérés</dt>
            <dd><StringList items={criteria.need.moderateSignals} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Signaux négatifs</dt>
            <dd><StringList items={criteria.need.negativeSignals} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Disqualifiants</dt>
            <dd><StringList items={criteria.need.disqualifiers} emptyLabel="Aucun" /></dd>
          </dl>
        </CriterionCard>

        <CriterionCard
          title="Timing"
          definition={criteria.timing.definition}
          statusValues={criteria.timing.statusValues}
        >
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-tertiary">Horizon qualifié</dt>
            <dd>{criteria.timing.qualifiedHorizonDays} jours</dd>
            <dt className="text-text-tertiary">Horizon nurture</dt>
            <dd>{criteria.timing.nurtureHorizonDays} jours</dd>
            <dt className="text-text-tertiary">Signaux négatifs</dt>
            <dd><StringList items={criteria.timing.negativeSignals} emptyLabel="Aucun" /></dd>
          </dl>
        </CriterionCard>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-app-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text-primary">Règles de qualification</h3>
          <dl className="mt-2 space-y-2 text-sm">
            <div>
              <dt className="text-text-tertiary">Qualifié si</dt>
              <dd>
                {Object.entries(criteria.qualificationRules.qualified).map(([key, values]) => (
                  <p key={key} className="text-text-secondary">
                    {key} ∈ {"{"}
                    {values.join(", ")}
                    {"}"}
                  </p>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Nurture si</dt>
              <dd>
                {Object.entries(criteria.qualificationRules.nurture).map(([key, values]) => (
                  <p key={key} className="text-text-secondary">
                    {key} ∈ {"{"}
                    {values.join(", ")}
                    {"}"}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-app-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text-primary">Transmission (handoff)</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-secondary">
            {criteria.handoffRules.explicitMeetingRequest ? <li>Demande explicite de rendez-vous</li> : null}
            {criteria.handoffRules.strongNeedAndHumanRequest ? (
              <li>Besoin fort + demande d’un humain</li>
            ) : null}
            {criteria.handoffRules.strongBuyingIntent ? <li>Intention d’achat forte</li> : null}
          </ul>
        </div>
      </div>

      {criteria.nurtureRules === null ? null : (
        <div className="rounded-app-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text-primary">Relances nurture</h3>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-tertiary">Nombre maximum de relances</dt>
            <dd className="text-text-secondary">{criteria.nurtureRules.maxFollowUps}</dd>
            <dt className="text-text-tertiary">Délai par statut de timing</dt>
            <dd className="text-text-secondary">
              {Object.entries(criteria.nurtureRules.followUpDelayDays).map(([status, days]) => (
                <p key={status}>
                  {status} : J+{days}
                </p>
              ))}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
