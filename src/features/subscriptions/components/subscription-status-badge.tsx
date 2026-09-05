import {
  subscriptionStatusLabels,
  type SubscriptionStatus,
} from "../model/subscription";

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {subscriptionStatusLabels[status]}
    </span>
  );
}
