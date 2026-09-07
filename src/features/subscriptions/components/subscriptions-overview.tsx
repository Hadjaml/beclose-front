import { EmptyState } from "@/shared/ui/states";
import type { Subscription } from "../model/subscription";
import { usageAttentionLabels } from "../model/subscription";
import { SubscriptionStatusBadge } from "./subscription-status-badge";

function getUsageAttentionLabel(subscription: Subscription) {
  const attention = subscription.usage.find(
    (item) => item.attention !== undefined && item.attention !== "NONE",
  )?.attention;

  return attention === undefined
    ? "Aucune attention"
    : usageAttentionLabels[attention];
}

export function SubscriptionsOverview({
  subscriptions,
}: {
  subscriptions: readonly Subscription[] | null;
}) {
  if (subscriptions === null || subscriptions.length === 0) {
    return (
      <EmptyState
        title="Aucun abonnement disponible"
        description="Les abonnements et situations nécessitant une attention apparaîtront ici."
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Supervision globale des abonnements</caption>
        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Client</th>
            <th scope="col" className="px-4 py-3">Plan</th>
            <th scope="col" className="px-4 py-3">Statut</th>
            <th scope="col" className="px-4 py-3">Prochaine échéance</th>
            <th scope="col" className="px-4 py-3">Usage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td className="px-4 py-4 font-semibold text-text-primary">
                {subscription.workspaceName ?? subscription.workspaceId}
              </td>
              <td className="px-4 py-4 text-text-secondary">{subscription.plan.commercialName}</td>
              <td className="px-4 py-4"><SubscriptionStatusBadge status={subscription.status} /></td>
              <td className="px-4 py-4 text-text-secondary">{subscription.nextBillingAt ?? "—"}</td>
              <td className="px-4 py-4 text-text-secondary">
                {getUsageAttentionLabel(subscription)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
