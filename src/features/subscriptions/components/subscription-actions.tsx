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
          className="min-h-10 rounded-app-md border border-border-strong px-3 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
