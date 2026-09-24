import { formatShare, plural } from "../model/format-share";
import type { ApprovalMetrics } from "../schemas/approval-metrics-schema";

/**
 * Correction rate of outbound messages, and where the organization stands
 * against EF-801 ("durably low correction rate" before ever considering
 * lighter human validation). Purely an informative reading: nothing is
 * automated, no automatic sending exists or can be switched on from here.
 * The criterion's parameters are Beclose's proposals, not yet validated —
 * said so on screen rather than presented as settled thresholds.
 */
export function ApprovalMetricsView({ metrics }: { metrics: ApprovalMetrics }) {
  return (
    <div className="space-y-4">
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-app-lg border border-border bg-surface p-4 lg:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Taux de correction
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
            {formatShare(metrics.correctionRate)}
          </dd>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            {metrics.decided === 0
              ? "Aucun message décidé pour l’instant."
              : `Sur ${plural(metrics.decided, "message")} décidé${metrics.decided > 1 ? "s" : ""} : ${metrics.corrected} corrigé${metrics.corrected > 1 ? "s" : ""} + ${metrics.rejected} rejeté${metrics.rejected > 1 ? "s" : ""}.`}
          </p>
        </div>
        {(
          [
            ["Acceptés tels quels", metrics.acceptedAsIs],
            ["Corrigés", metrics.corrected],
            ["Rejetés", metrics.rejected],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-app-lg border border-border bg-surface p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-text-tertiary">
        {plural(metrics.pending, "message")} en attente de décision, non compté
        {metrics.pending > 1 ? "s" : ""} dans le taux.
      </p>

      {metrics.consecutive === null ? (
        <WindowCriterion metrics={metrics} />
      ) : (
        <ConsecutiveCriterion metrics={metrics} consecutive={metrics.consecutive} />
      )}
    </div>
  );
}

const NOTHING_AUTOMATED =
  "Ce constat est purement informatif : rien n’est automatisé et aucun envoi sans validation n’existe ni ne peut être activé d’ici. Passer un client en envoi sans validation reste une décision humaine explicite.";

/** The finding since Beclose's `consecutive`: validations in a row without a
 * correction, only counted above a minimum volume. */
function ConsecutiveCriterion({
  metrics,
  consecutive,
}: {
  metrics: ApprovalMetrics;
  consecutive: NonNullable<ApprovalMetrics["consecutive"]>;
}) {
  const { criterion } = metrics;
  return (
    <div
      className={`rounded-app-lg border p-4 ${
        consecutive.met ? "border-emerald-200 bg-emerald-50" : "border-border bg-surface-muted"
      }`}
    >
      <p className="text-sm font-semibold text-text-primary">
        {consecutive.met
          ? "Constat : critère atteint"
          : consecutive.sufficientVolume
            ? "Constat : critère pas encore atteint"
            : "Constat : pas assez de messages décidés pour conclure"}
      </p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        {plural(consecutive.count, "validation")} consécutive{consecutive.count > 1 ? "s" : ""} sans
        correction ({consecutive.required} requises), remis à zéro par une correction ou un rejet.
        Le critère ne compte qu’à partir d’un volume minimum de {consecutive.minimumVolume} messages
        décidés ({consecutive.decided} pour l’instant).
      </p>
      <p className="mt-2 text-xs leading-5 text-text-tertiary">
        Indicatif : fenêtres de {criterion.windowSize} messages décidés, {criterion.windowsRequired}{" "}
        dernières fenêtres à {formatShare(criterion.maxCorrectionRate)} de correction ou moins
        {criterion.windowRates.length === 0
          ? " — aucune fenêtre complète."
          : ` (mesurées, de la plus récente à la plus ancienne : ${criterion.windowRates
              .map((rate) => formatShare(rate))
              .join(", ")}).`}
      </p>
      <p className="mt-2 text-xs leading-5 text-text-tertiary">
        {NOTHING_AUTOMATED} Les paramètres du critère ({consecutive.required} validations,{" "}
        {consecutive.minimumVolume} messages) sont provisoires, en attente de validation.
      </p>
    </div>
  );
}

/** Kept for a backend that predates `consecutive`. */
function WindowCriterion({ metrics }: { metrics: ApprovalMetrics }) {
  const { criterion } = metrics;
  return (
    <div
      className={`rounded-app-lg border p-4 ${
        criterion.met ? "border-emerald-200 bg-emerald-50" : "border-border bg-surface-muted"
      }`}
    >
      <p className="text-sm font-semibold text-text-primary">
        {criterion.met
          ? "Constat : taux de correction durablement faible"
          : criterion.sufficientData
            ? "Constat : taux de correction pas (encore) durablement faible"
            : "Constat : pas assez de messages décidés pour conclure"}
      </p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        Critère : les {criterion.windowsRequired} dernières fenêtres complètes de {criterion.windowSize}{" "}
        messages décidés doivent toutes être à {formatShare(criterion.maxCorrectionRate)} de correction
        ou moins.
        {criterion.windowRates.length === 0
          ? " Aucune fenêtre complète pour l’instant."
          : ` Fenêtres mesurées (de la plus récente à la plus ancienne) : ${criterion.windowRates
              .map((rate) => formatShare(rate))
              .join(", ")}.`}
      </p>
      <p className="mt-2 text-xs leading-5 text-text-tertiary">
        {NOTHING_AUTOMATED} Les seuils du critère sont des propositions, pas encore validées.
      </p>
    </div>
  );
}
