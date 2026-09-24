import { formatShare, plural } from "../model/format-share";
import type { Precision } from "../schemas/precision-schema";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-app-lg border border-border bg-surface p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</dd>
      {hint === undefined ? null : <p className="mt-1 text-xs leading-5 text-text-secondary">{hint}</p>}
    </div>
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
