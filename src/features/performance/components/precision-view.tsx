import { formatShare, plural } from "../model/format-share";
import type { Precision, Targeting } from "../schemas/precision-schema";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-app-lg border border-border bg-surface p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</dd>
      {hint === undefined ? null : <p className="mt-1 text-xs leading-5 text-text-secondary">{hint}</p>}
    </div>
  );
}

/** Conformity to the ICP of the sourced companies. Unknowns and
 * "not recorded" are shown apart and never as failures or successes. */
function TargetingSection({ targeting }: { targeting: Targeting }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-text-primary">
        Ciblage : entreprises sourcées conformes à l’ICP
      </h3>
      <p className="text-sm leading-6 text-text-secondary">
        Ce que le sourcing a réellement ciblé, jugé sur la version d’ICP avec laquelle chaque
        entreprise a été sourcée (tranche d’effectif). C’est distinct de la mesure BANT ci-dessous,
        qui porte sur les leads transmis.
      </p>
      {targeting.measurable === 0 ? (
        <p className="rounded-app-md border border-border bg-surface-muted p-3 text-sm text-text-secondary">
          Rien de mesurable pour l’instant : {plural(targeting.sourced, "entreprise")} sourcée
          {targeting.sourced > 1 ? "s" : ""} avec une version d’ICP, aucune dont la tranche d’effectif
          soit connue.
        </p>
      ) : null}
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Part conforme"
          value={formatShare(targeting.conformShare)}
          hint={`Calculée sur les ${plural(targeting.measurable, "entreprise")} mesurables (inconnues exclues) — couverture ${formatShare(targeting.coverage)} des entreprises sourcées.`}
        />
        <Stat label="Sourcées (avec version d’ICP)" value={String(targeting.sourced)} />
        <Stat
          label="Sans version d’ICP enregistrée"
          value={String(targeting.notRecorded)}
          hint="Sourcing manuel ou antérieur au suivi : comptées à part, jamais comptées comme conformes."
        />
        <Stat label="Conformes" value={String(targeting.conform)} hint="Tranche d’effectif dans la fourchette préférée." />
        <Stat
          label="Tolérées"
          value={String(targeting.tolerated)}
          hint="Tranche hors de la fourchette préférée mais dans les bornes de rejet."
        />
        <Stat label="Non conformes" value={String(targeting.nonConform)} hint="Hors des bornes de rejet." />
        <Stat
          label="Inconnues"
          value={String(targeting.unknown)}
          hint="Tranche d’effectif inconnue : non évaluables, pas un échec — séparées de la mesure."
        />
      </dl>
      {targeting.byIcpVersion.length === 0 ? null : (
        <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="px-4 py-2 font-semibold">Version d’ICP</th>
                <th className="px-4 py-2 font-semibold">Sourcées</th>
                <th className="px-4 py-2 font-semibold">Conformes</th>
                <th className="px-4 py-2 font-semibold">Tolérées</th>
                <th className="px-4 py-2 font-semibold">Non conformes</th>
                <th className="px-4 py-2 font-semibold">Inconnues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {targeting.byIcpVersion.map((row) => (
                <tr key={row.profileId}>
                  <td className="px-4 py-2 font-medium text-text-primary">Version {row.version}</td>
                  <td className="px-4 py-2">{row.sourced}</td>
                  <td className="px-4 py-2">{row.conform}</td>
                  <td className="px-4 py-2">{row.tolerated}</td>
                  <td className="px-4 py-2">{row.nonConform}</td>
                  <td className="px-4 py-2">{row.unknown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/**
 * The components of "precision", each under its own real name. There is
 * deliberately **no single precision figure** here: its numeric definition
 * (the 80–90 % target) is not settled, and any one number would be
 * misleading — a closing rate in particular says nothing about relevance
 * unless you can see how few outcomes it rests on, so every rate is shown
 * next to its coverage.
 */
export function PrecisionView({ precision }: { precision: Precision }) {
  const { automatic, manual } = precision;
  const declared = manual.won + manual.lost;

  return (
    <div className="space-y-6">
      <p className="rounded-app-md border border-border bg-surface-muted p-4 text-sm leading-6 text-text-secondary">
        La « précision » (part des leads transmis réellement pertinents pour le client) n’a pas
        encore de définition chiffrée arrêtée : <strong>aucun chiffre unique n’est affiché</strong>.
        Voici ce qui est réellement mesuré, composante par composante.
      </p>

      {precision.targeting === null ? null : <TargetingSection targeting={precision.targeting} />}

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">Leads transmis</h3>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Transmis" value={String(precision.transmitted)} />
          <Stat label="RDV pris" value={String(precision.booked)} />
          <Stat label="Besoin fort" value={String(precision.handedOffStrongNeed)} hint="Transférés sur un signal de besoin fort." />
          <Stat
            label="Cause technique"
            value={String(precision.handedOffTechnical)}
            hint="Transférés après un échec de prise de RDV — pas un signal de pertinence."
          />
          <Stat label="Convertis" value={String(precision.converted)} />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">Mesure automatique (selon la grille)</h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Stat
            label="Qualifiés selon la grille BANT"
            value={formatShare(automatic.qualifiedShare)}
            hint={
              precision.transmitted === 0
                ? "Aucun lead transmis pour l’instant."
                : `${automatic.qualifiedByGrid} sur ${plural(precision.transmitted, "lead")} transmis. C’est un indicateur selon les propres critères du client, pas la pertinence réelle.`
            }
          />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">Issues déclarées (à la main)</h3>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Gagnés" value={String(manual.won)} />
          <Stat label="Perdus" value={String(manual.lost)} />
          <Stat label="Sans issue déclarée" value={String(manual.unknown)} />
          <Stat
            label="Couverture des issues"
            value={formatShare(manual.outcomeCoverage)}
            hint={
              precision.transmitted === 0
                ? "Aucun lead transmis pour l’instant."
                : `${plural(declared, "issue")} déclarée${declared > 1 ? "s" : ""} sur ${plural(precision.transmitted, "lead")} transmis.`
            }
          />
        </dl>
        <div className="rounded-app-lg border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Taux de closing des issues déclarées
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
            {formatShare(manual.winRateAmongKnown)}
          </p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {declared === 0
              ? "Aucune issue déclarée : rien à calculer."
              : `${manual.won} gagné${manual.won > 1 ? "s" : ""} sur ${plural(declared, "issue")} déclarée${declared > 1 ? "s" : ""} — à lire avec la couverture ci-dessus : sur ${plural(precision.transmitted, "lead")} transmis, ${manual.unknown} n’ont aucune issue déclarée.`}
          </p>
          <p className="mt-2 text-xs leading-5 text-text-tertiary">
            Ce n’est pas une précision : un lead perdu peut très bien avoir été pertinent, et les
            clients sous-déclarent souvent leurs issues.
          </p>
        </div>
      </section>
    </div>
  );
}
