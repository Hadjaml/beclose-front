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
    <section className="rounded-app-md border border-border bg-surface-muted p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Action recommandée</p>
      <h3 className="mt-2 text-sm font-semibold text-text-primary">
        {recommendedConversationActionLabels[recommendation.action]}
      </h3>
      {recommendation.justification === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-text-secondary">{recommendation.justification}</p>
      )}
      {action === undefined ? null : <div className="mt-4">{action}</div>}
    </section>
  );
}
