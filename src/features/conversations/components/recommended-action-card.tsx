import {
  recommendedConversationActionLabels,
  type ConversationRecommendation,
} from "../model/conversation";

interface RecommendedActionCardProps {
  recommendation: ConversationRecommendation;
  action?: React.ReactNode;
}

export function RecommendedActionCard({
  recommendation,
  action,
}: RecommendedActionCardProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Action recommandée</p>
      <h3 className="mt-2 text-sm font-semibold text-zinc-950">
        {recommendedConversationActionLabels[recommendation.action]}
      </h3>
      {recommendation.justification === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-zinc-600">{recommendation.justification}</p>
      )}
      {action === undefined ? null : <div className="mt-4">{action}</div>}
    </section>
  );
}
