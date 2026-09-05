"use client";

import type { Subscription, SubscriptionAction } from "../model/subscription";

export function SubscriptionActions({
  subscription,
  onAction,
}: {
  subscription: Subscription;
  onAction?: (subscription: Subscription, action: SubscriptionAction) => void;
}) {
  if (onAction === undefined || subscription.actions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {subscription.actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onAction(subscription, action)}
          className="min-h-10 rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
