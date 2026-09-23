import type { ReactNode } from "react";
import type { IcpCriteriaWire } from "../schemas/icp-criteria-wire-schema";

/** Structured rendering of the real ICP profile (`icp_profiles.criteria`,
 * `icpCriteriaWireSchema`) — replaces the raw JSON dump. Presentation only. */

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

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-app-lg border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

export function IcpCriteriaView({ criteria }: { criteria: IcpCriteriaWire }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">{criteria.purpose}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Block title="Marché">
          <dl className="space-y-2 text-sm">
            <dt className="text-text-tertiary">Modèle économique</dt>
            <dd><StringList items={criteria.market.businessModel} emptyLabel="Non renseigné" /></dd>
            <dt className="text-text-tertiary">Zones géographiques</dt>
            <dd><StringList items={criteria.market.geographies} emptyLabel="Non renseigné" /></dd>
            <dt className="text-text-tertiary">Mode de vente</dt>
            <dd><StringList items={criteria.market.salesMotion} emptyLabel="Non renseigné" /></dd>
          </dl>
        </Block>

        <Block title="Adéquation entreprise">
          <dl className="space-y-2 text-sm">
            <dt className="text-text-tertiary">Effectif</dt>
            <dd className="text-text-secondary">
              {criteria.companyFit.employeeRange.min}–{criteria.companyFit.employeeRange.max}
              {criteria.companyFit.employeeRange.rejectBelow === null &&
              criteria.companyFit.employeeRange.rejectAbove === null
                ? null
                : ` (rejeté hors de ${criteria.companyFit.employeeRange.rejectBelow ?? "−∞"}–${
                    criteria.companyFit.employeeRange.rejectAbove ?? "+∞"
                  })`}
            </dd>
            <dt className="text-text-tertiary">CA annuel minimum préféré</dt>
            <dd className="text-text-secondary">
              {criteria.companyFit.annualRevenue.preferredMinEur.toLocaleString("fr-FR")} €
            </dd>
            <dt className="text-text-tertiary">Panier client minimum préféré</dt>
            <dd className="text-text-secondary">
              {criteria.companyFit.averageCustomerValue.preferredMinEur.toLocaleString("fr-FR")} €
              {criteria.companyFit.averageCustomerValue.reason === null
                ? null
                : ` — ${criteria.companyFit.averageCustomerValue.reason}`}
            </dd>
            <dt className="text-text-tertiary">Exigences</dt>
            <dd className="text-text-secondary">
              {[
                criteria.companyFit.validatedOfferRequired ? "Offre validée" : null,
                criteria.companyFit.existingCustomersRequired ? "Clients existants" : null,
                criteria.companyFit.humanClosingCapacityRequired ? "Capacité de closing humaine" : null,
              ]
                .filter((label): label is string => label !== null)
                .join(", ") || "Aucune"}
            </dd>
          </dl>
        </Block>
      </div>

      <Block title="Secteurs prioritaires">
        <div className="space-y-2">
          {criteria.prioritySectors.map((tier) => (
            <div key={tier.tier} className="text-sm">
              <span className="font-medium text-text-primary">Tier {tier.tier}</span>{" "}
              <span className="text-text-secondary">
                {tier.sectors.map((sector) => sector.labelFr ?? sector.id).join(", ")}
              </span>
            </div>
          ))}
        </div>
      </Block>

      <div className="grid gap-3 sm:grid-cols-2">
        <Block title="Maturité commerciale">
          <dl className="space-y-2 text-sm">
            <dt className="text-text-tertiary">Niveau préféré</dt>
            <dd className="text-text-secondary">
              {criteria.commercialMaturity.levels[criteria.commercialMaturity.preferredLevel] ??
                criteria.commercialMaturity.preferredLevel}
            </dd>
            <dt className="text-text-tertiary">Niveaux ciblés</dt>
            <dd className="text-text-secondary">
              {criteria.commercialMaturity.targetLevels
                .map((level) => criteria.commercialMaturity.levels[level] ?? level)
                .join(", ")}
            </dd>
            <dt className="text-text-tertiary">Niveaux exclus</dt>
            <dd className="text-text-secondary">
              {criteria.commercialMaturity.excludedLevels.length === 0
                ? "Aucun"
                : criteria.commercialMaturity.excludedLevels
                    .map((level) => criteria.commercialMaturity.levels[level] ?? level)
                    .join(", ")}
            </dd>
          </dl>
        </Block>

        <Block title="Décideurs visés">
          <dl className="space-y-2 text-sm">
            <dt className="text-text-tertiary">Titres principaux</dt>
            <dd><StringList items={criteria.decisionMakers.primary} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Titres secondaires</dt>
            <dd><StringList items={criteria.decisionMakers.secondary} emptyLabel="Aucun" /></dd>
            <dt className="text-text-tertiary">Relais potentiels</dt>
            <dd><StringList items={criteria.decisionMakers.potentialChampions} emptyLabel="Aucun" /></dd>
          </dl>
        </Block>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Block title="Signaux positifs">
          <StringList items={criteria.positiveSignals} emptyLabel="Aucun" />
        </Block>
        <Block title="Signaux négatifs">
          <StringList items={criteria.negativeSignals} emptyLabel="Aucun" />
        </Block>
        <Block title="Disqualifiants stricts">
          <StringList items={criteria.hardDisqualifiers} emptyLabel="Aucun" />
        </Block>
      </div>
    </div>
  );
}
