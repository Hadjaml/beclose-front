import {
  handoffPriorityLabels,
  type HandoffRecommendation,
} from "../model/handoff";

interface HandoffRecommendationCardProps {
  recommendation: HandoffRecommendation;
}

export function HandoffRecommendationCard({
  recommendation,
}: HandoffRecommendationCardProps) {
  if (!recommendation.recommended) {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-amber-950">
          Intervention humaine recommandée
        </h3>
        {recommendation.priority === undefined ? null : (
          <span className="text-sm font-medium text-amber-900">
            Priorité {handoffPriorityLabels[recommendation.priority].toLocaleLowerCase("fr")}
          </span>
        )}
      </div>
      {recommendation.reason === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-amber-900">{recommendation.reason}</p>
      )}
      {recommendation.triggers?.length ? (
        <ul className="mt-3 space-y-1 text-sm text-amber-900">
          {recommendation.triggers.map((trigger) => <li key={trigger}>{trigger}</li>)}
        </ul>
      ) : null}
    </section>
  );
}
