import {
  subscriptionStatusLabels,
  type SubscriptionStatus,
} from "../model/subscription";

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-secondary">
      {subscriptionStatusLabels[status]}
    </span>
  );
}
